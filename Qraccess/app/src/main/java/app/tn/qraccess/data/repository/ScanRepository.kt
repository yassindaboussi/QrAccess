package app.tn.qraccess.data.repository

import app.tn.qraccess.data.api.ApiClient
import app.tn.qraccess.data.model.ApiResponse
import app.tn.qraccess.data.model.ScanHistoryResponse
import app.tn.qraccess.data.model.ScanLog
import app.tn.qraccess.data.model.ScanRequest
import app.tn.qraccess.data.model.ScanResult
import app.tn.qraccess.data.model.ScannedUser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject

class ScanRepository {

    sealed class ScanResult {
        data class Granted(
            val message: String,
            val userName: String,
            val user: ScannedUser?
        ) : ScanResult()

        data class Denied(
            val message: String,
            val reason: String,
            val user: ScannedUser?
        ) : ScanResult()

        data class Error(val message: String) : ScanResult()
        object Loading : ScanResult()
    }

    sealed class HistoryResult {
        data class Success(val scans: List<app.tn.qraccess.data.model.ScanResult>, val total: Int) : HistoryResult()
        data class Error(val message: String) : HistoryResult()
        object Loading : HistoryResult()
    }

    suspend fun verifyQR(qrData: String): ScanResult = withContext(Dispatchers.IO) {
        try {
            val response = ApiClient.scanApi.verifyQR(ScanRequest(qrData))

            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!

                if (apiResponse.success && apiResponse.data != null) {
                    val scanResult = apiResponse.data

                    return@withContext if (scanResult.status == "granted") {
                        ScanResult.Granted(
                            message = scanResult.message,
                            userName = scanResult.user?.fullName ?: "Unknown",
                            user = scanResult.user
                        )
                    } else {
                        ScanResult.Denied(
                            message = scanResult.message,
                            reason = scanResult.reason ?: "Unknown reason",
                            user = scanResult.user
                        )
                    }
                } else {
                    return@withContext ScanResult.Error(apiResponse.error?.message ?: "Scan failed")
                }
            } else {
                // Handle error responses (403, etc.) that contain scan result details
                val errorBody = response.errorBody()?.string()
                println("ScanRepository: Error response body: $errorBody")
                
                if (response.code() == 403 && errorBody != null) {
                    try {
                        // Parse error response to extract scan details (like frontend)
                        val jsonElement = Json.parseToJsonElement(errorBody)
                        val errorJson = jsonElement.jsonObject
                        
                        if (errorJson != null) {
                            val errorObject = errorJson["error"]?.jsonObject
                            val details = errorObject?.get("details")
                            
                            if (details != null) {
                                val detailsObject = details.jsonObject
                                val status = detailsObject["status"]?.toString()?.removeSurrounding("\"")
                                val reason = detailsObject["reason"]?.toString()?.removeSurrounding("\"")
                                val message = detailsObject["message"]?.toString()?.removeSurrounding("\"")
                                val userJson = detailsObject["user"]
                                
                                if (status == "denied" && userJson != null) {
                                    // Parse user details from error response
                                    val userObject = userJson.jsonObject
                                    val fullName = userObject["fullName"]?.toString()?.removeSurrounding("\"")
                                    val email = userObject["email"]?.toString()?.removeSurrounding("\"")
                                    val phone = userObject["phoneNumber"]?.toString()?.removeSurrounding("\"")
                                    val uniqueCode = userObject["uniqueCode"]?.toString()?.removeSurrounding("\"")
                                    val subscriptionType = userObject["subscriptionType"]?.toString()?.removeSurrounding("\"")
                                    val subscriptionStart = userObject["subscriptionStart"]?.toString()?.removeSurrounding("\"")
                                    val subscriptionEnd = userObject["subscriptionEnd"]?.toString()?.removeSurrounding("\"")
                                    val subscriptionNotes = userObject["subscriptionNotes"]?.toString()?.removeSurrounding("\"")
                                    val createdAt = userObject["createdAt"]?.toString()?.removeSurrounding("\"")
                                    val id = userObject["_id"]?.toString() ?: ""
                                    
                                    val scannedUser = ScannedUser(
                                        id = id,
                                        fullName = fullName ?: "Unknown",
                                        email = email ?: "",
                                        phoneNumber = phone ?: "",
                                        uniqueCode = uniqueCode ?: "",
                                        subscriptionType = subscriptionType ?: "",
                                        subscriptionStart = subscriptionStart ?: "",
                                        subscriptionEnd = subscriptionEnd ?: "",
                                        subscriptionNotes = subscriptionNotes ?: "",
                                        createdAt = createdAt ?: ""
                                    )
                                    
                                    return@withContext ScanResult.Denied(
                                        message = message ?: "Access Denied",
                                        reason = reason ?: "Unknown reason",
                                        user = scannedUser
                                    )
                                }
                            }
                        }
                    } catch (e: Exception) {
                        println("ScanRepository: Failed to parse error response: ${e.message}")
                    }
                } 
                return@withContext ScanResult.Error("Server error: ${response.code()} - ${response.message()}")
            }
        } catch (e: Exception) {
            return@withContext ScanResult.Error("Network error: ${e.message}")
        }
    }

    suspend fun getScanHistory(
        page: Int = 1,
        limit: Int = 50,
        from: String? = null,
        to: String? = null,
        result: String? = null
    ): HistoryResult = withContext(Dispatchers.IO) {
        try {
            val response = ApiClient.scanApi.getScanHistory(page, limit, from, to, result)
            
            if (response.isSuccessful && response.body() != null) {
                val historyResponse = response.body()!!
                
                if (historyResponse.success) {
                    val scanResults = historyResponse.data.scans.map { scanLog: ScanLog ->
                        // Convert ScanLog to ScanResult directly
                        app.tn.qraccess.data.model.ScanResult(
                            status = scanLog.result,
                            message = if (scanLog.result == "granted") "Access granted" else "Access denied",
                            reason = scanLog.reason,
                            user = scanLog.userId?.let { userRef ->
                                ScannedUser(
                                    id = userRef.id,
                                    fullName = userRef.fullName,
                                    email = userRef.email,
                                    phoneNumber = null, // Not available in scan history
                                    uniqueCode = userRef.uniqueCode,
                                    subscriptionType = null, // Not available in scan history
                                    subscriptionStart = null,
                                    subscriptionEnd = null,
                                    subscriptionNotes = null,
                                    createdAt = scanLog.scannedAt
                                )
                            }
                        )
                    }
                    HistoryResult.Success(scanResults, historyResponse.data.pagination.total)
                } else {
                    HistoryResult.Error("Failed to load scan history")
                }
            } else {
                HistoryResult.Error("Server error: ${response.code()}")
            }
        } catch (e: Exception) {
            HistoryResult.Error("Network error: ${e.message}")
        }
    }
}