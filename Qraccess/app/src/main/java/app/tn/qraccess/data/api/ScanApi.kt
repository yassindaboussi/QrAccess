package app.tn.qraccess.data.api

import app.tn.qraccess.data.model.ApiResponse
import app.tn.qraccess.data.model.ScanHistoryResponse
import app.tn.qraccess.data.model.ScanRequest
import app.tn.qraccess.data.model.ScanResult
import retrofit2.Response
import retrofit2.http.*

interface ScanApi {
    @POST("scan")
    suspend fun verifyQR(@Body request: ScanRequest): Response<ApiResponse<ScanResult>>

    @GET("scan/history")
    suspend fun getScanHistory(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 50,
        @Query("from") from: String? = null,
        @Query("to") to: String? = null,
        @Query("result") result: String? = null
    ): Response<ScanHistoryResponse>
}