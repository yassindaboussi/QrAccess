package app.tn.qraccess.data.api

import app.tn.qraccess.data.model.LoginRequest
import app.tn.qraccess.data.model.LoginResponse
import retrofit2.Response
import retrofit2.http.*

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/logout")
    suspend fun logout(): Response<Unit>

    @GET("auth/profile")
    suspend fun getProfile(): Response<Any>
}