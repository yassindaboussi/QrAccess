package app.tn.qraccess.data.model

import com.google.gson.annotations.SerializedName

data class ScanHistoryResponse(
    val success: Boolean,
    val data: ScanHistoryData
)

data class ScanHistoryData(
    val scans: List<ScanLog>,
    val pagination: Pagination
)

data class ScanLog(
    @SerializedName("_id")
    val id: String,
    @SerializedName("userId")
    val userId: UserRef?, // Can be User object or string ID
    @SerializedName("uniqueCode")
    val uniqueCode: String,
    @SerializedName("scannerId")
    val scannerId: ScannerInfo,
    @SerializedName("result")
    val result: String, // "granted" or "denied"
    @SerializedName("reason")
    val reason: String, // "active", "expired", "not_started", "no_subscription", "invalid_code", "not_found", "system_error"
    @SerializedName("subscriptionStatus")
    val subscriptionStatus: String?, // "active", "expired", "none"
    @SerializedName("scannedAt")
    val scannedAt: String
)

data class UserRef(
    @SerializedName("_id")
    val id: String,
    @SerializedName("fullName")
    val fullName: String,
    @SerializedName("email")
    val email: String?,
    @SerializedName("uniqueCode")
    val uniqueCode: String
)

data class ScannerInfo(
    @SerializedName("_id")
    val id: String,
    @SerializedName("username")
    val username: String
)

data class Pagination(
    val total: Int,
    val page: Int,
    val pages: Int,
    val limit: Int
)

// For backward compatibility with existing UI
fun ScanLog.toScanResult(): ScanResult {
    return ScanResult(
        status = this.result,
        message = if (this.result == "granted") "Access granted" else "Access denied",
        reason = this.reason,
        user = this.userId?.let { user ->
            ScannedUser(
                id = user.id,
                fullName = user.fullName,
                email = user.email,
                phoneNumber = null, // Not available in scan history
                uniqueCode = user.uniqueCode,
                subscriptionType = null, // Not available in scan history
                subscriptionStart = null,
                subscriptionEnd = null,
                subscriptionNotes = null,
                createdAt = this.scannedAt
            )
        }
    )
}
