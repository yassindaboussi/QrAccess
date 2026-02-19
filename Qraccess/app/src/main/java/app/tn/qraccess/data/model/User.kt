package app.tn.qraccess.data.model

import com.google.gson.annotations.SerializedName

data class User(
    val id: String,
    @SerializedName("fullName")
    val fullName: String,
    val email: String?,
    @SerializedName("phoneNumber")
    val phoneNumber: String?,
    @SerializedName("uniqueCode")
    val uniqueCode: String
)

data class Admin(
    @SerializedName("_id")
    val id: String,
    val username: String,
    val email: String,
    val role: String
)