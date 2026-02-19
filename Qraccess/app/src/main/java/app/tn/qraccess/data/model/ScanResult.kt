package app.tn.qraccess.data.model

import com.google.gson.annotations.SerializedName

data class ScanResult(
    val status: String, // "granted" or "denied"
    val message: String,
    val reason: String?,
    val user: ScannedUser?
)

data class ScannedUser(
    @SerializedName("_id")
    val id: String,
    @SerializedName("fullName")
    val fullName: String,
    @SerializedName("email")
    val email: String?,
    @SerializedName("phoneNumber")
    val phoneNumber: String?,
    @SerializedName("uniqueCode")
    val uniqueCode: String,
    @SerializedName("subscriptionType")
    val subscriptionType: String?,
    @SerializedName("subscriptionStart")
    val subscriptionStart: String?,
    @SerializedName("subscriptionEnd")
    val subscriptionEnd: String?,
    @SerializedName("subscriptionNotes")
    val subscriptionNotes: String?,
    @SerializedName("createdAt")
    val createdAt: String
)

data class ScanRequest(
    @SerializedName("qrData")
    val qrData: String
)

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: ApiError?
)

data class ApiError(
    val code: String,
    val message: String,
    val details: Map<String, Any>?
)