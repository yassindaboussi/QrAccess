package app.tn.qraccess.utils

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.runBlocking

private val Context.dataStore by preferencesDataStore(name = "auth_prefs")

object TokenManager {
    private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
    private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
    private val USER_EMAIL_KEY = stringPreferencesKey("user_email")

    @Volatile private var appContext: Context? = null

    fun init(context: Context) {
        appContext = context.applicationContext
        println("TokenManager initialized with context: ${context.applicationContext}")
    }

    suspend fun saveTokens(accessToken: String, refreshToken: String) {
        val context = appContext ?: run {
            println("ERROR: TokenManager not initialized when saving tokens")
            return
        }
        context.dataStore.edit { preferences ->
            preferences[ACCESS_TOKEN_KEY] = accessToken
            preferences[REFRESH_TOKEN_KEY] = refreshToken
        }
        println("Tokens saved: access_token=${accessToken.take(10)}..., refresh_token=${refreshToken.take(10)}...")
    }

    suspend fun saveUserInfo(email: String) {
        val context = appContext ?: run {
            println("ERROR: TokenManager not initialized when saving user info")
            return
        }
        context.dataStore.edit { preferences ->
            preferences[USER_EMAIL_KEY] = email
        }
        println("User info saved: email=$email")
    }

    suspend fun getAccessToken(): String? {
        return try {
            val context = appContext ?: run {
                println("ERROR: TokenManager not initialized when getting access token")
                return null
            }
            context.dataStore.data
                .map { preferences -> preferences[ACCESS_TOKEN_KEY] }
                .first()
        } catch (e: Exception) {
            null
        }
    }

    // Synchronous getter for use in interceptors
    fun getAccessTokenSync(): String? {
        return try {
            val context = appContext ?: return null
            runBlocking {
                context.dataStore.data
                    .map { preferences -> preferences[ACCESS_TOKEN_KEY] }
                    .first()
            }
        } catch (e: Exception) {
            null
        }
    }

    val accessTokenFlow: Flow<String?> = flow {
        // Always emit the current token value
        try {
            val context = appContext ?: return@flow
            context.dataStore.data.map { preferences ->
                preferences[ACCESS_TOKEN_KEY]
            }.collect { token ->
                println("TokenManager.accessTokenFlow: emitting token=${token?.take(10)}...")
                emit(token)
            }
        } catch (e: Exception) {
            println("TokenManager.accessTokenFlow: error - ${e.message}")
            emit(null)
        }
    }

    val userEmailFlow: Flow<String?> = flow {
        // Always emit the current user email value
        try {
            val context = appContext ?: return@flow
            context.dataStore.data.map { preferences ->
                preferences[USER_EMAIL_KEY]
            }.collect { email ->
                println("TokenManager.userEmailFlow: emitting email=$email")
                emit(email)
            }
        } catch (e: Exception) {
            println("TokenManager.userEmailFlow: error - ${e.message}")
            emit(null)
        }
    }

    suspend fun clearTokens() {
        val context = appContext ?: run {
            println("ERROR: TokenManager not initialized when clearing tokens")
            return
        }
        println("Clearing all tokens from DataStore...")
        context.dataStore.edit { preferences ->
            preferences.clear()
        }
        println("Tokens cleared successfully")
    }
}