package app.tn.qraccess.data.repository

import app.tn.qraccess.data.api.ApiClient
import app.tn.qraccess.data.model.LoginRequest
import app.tn.qraccess.utils.TokenManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

class AuthRepository {

    sealed class AuthResult {
        data class Success(val message: String) : AuthResult()
        data class Error(val message: String) : AuthResult()
        object Loading : AuthResult()
    }

    suspend fun login(email: String, password: String): AuthResult = withContext(Dispatchers.IO) {
        try {
            val response = ApiClient.authApi.login(LoginRequest(email, password))

            if (response.isSuccessful && response.body() != null) {
                val loginResponse = response.body()!!
                if (loginResponse.success) {
                    // Save tokens
                    TokenManager.saveTokens(
                        loginResponse.data.tokens.accessToken,
                        loginResponse.data.tokens.refreshToken
                    )

                    // Save user info
                    TokenManager.saveUserInfo(email)

                    return@withContext AuthResult.Success("Login successful")
                } else {
                    return@withContext AuthResult.Error("Login failed")
                }
            } else {
                return@withContext AuthResult.Error("Server error: ${response.code()}")
            }
        } catch (e: Exception) {
            return@withContext AuthResult.Error("Network error: ${e.message}")
        }
    }

    suspend fun logout(): AuthResult = withContext(Dispatchers.IO) {
        try {
            ApiClient.authApi.logout()
            TokenManager.clearTokens()
            AuthResult.Success("Logged out successfully")
        } catch (e: Exception) {
            // Still clear tokens even if API fails
            TokenManager.clearTokens()
            AuthResult.Success("Logged out locally")
        }
    }

    fun isLoggedIn(): Flow<Boolean> = TokenManager.accessTokenFlow.map { token ->
        val isLoggedIn = !token.isNullOrEmpty()
        println("AuthRepository.isLoggedIn: token=${token?.take(10)}..., isLoggedIn=$isLoggedIn")
        isLoggedIn
    }
}