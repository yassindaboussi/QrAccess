package app.tn.qraccess.presentation.screens.scanner

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import app.tn.qraccess.data.repository.AuthRepository
import app.tn.qraccess.data.repository.ScanRepository
import app.tn.qraccess.utils.TokenManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ScannerViewModel(
    private val scanRepository: ScanRepository = ScanRepository(),
    private val authRepository: AuthRepository = AuthRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(ScannerUiState())
    val uiState: StateFlow<ScannerUiState> = _uiState.asStateFlow()

    private val _scanResult = MutableStateFlow<ScanRepository.ScanResult?>(null)
    val scanResult: StateFlow<ScanRepository.ScanResult?> = _scanResult.asStateFlow()

    private var lastScannedQrData: String? = null
    private var lastScanTime: Long = 0

    init {
        loadUserInfo()
    }

    private fun loadUserInfo() {
        viewModelScope.launch {
            TokenManager.userEmailFlow.collect { email ->
                _uiState.update { it.copy(userEmail = email ?: "Scanner") }
            }
        }
    }

    fun onQrCodeScanned(qrData: String, onNavigateToResult: (ScanRepository.ScanResult) -> Unit) {
        // Prevent multiple scans of the same QR code within 2 seconds
        val currentTime = System.currentTimeMillis()
        if (qrData == lastScannedQrData && currentTime - lastScanTime < 2000) {
            println("ScannerViewModel: Ignoring duplicate scan of $qrData")
            return
        }

        viewModelScope.launch {
            lastScannedQrData = qrData
            lastScanTime = currentTime
            
            _uiState.update { it.copy(isScanning = true) }
            _scanResult.update { ScanRepository.ScanResult.Loading }

            println("ScannerViewModel: Processing QR code: $qrData")
            val result = scanRepository.verifyQR(qrData)
            println("ScannerViewModel: Scan result: $result")

            _scanResult.update { result }
            _uiState.update { it.copy(isScanning = false) }
            
            // Navigate to result screen
            onNavigateToResult(result)
        }
    }

    fun clearResult() {
        _scanResult.update { null }
        _uiState.update { it.copy(showResult = false) }
        lastScannedQrData = null
        lastScanTime = 0
    }

    fun onLogoutClick(onLogout: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            val result = authRepository.logout()

            _uiState.update { it.copy(isLoading = false) }

            if (result is AuthRepository.AuthResult.Success) {
                onLogout()
            }
        }
    }

    companion object {
        fun provideFactory(): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return ScannerViewModel() as T
            }
        }
    }
}

data class ScannerUiState(
    val userEmail: String = "",
    val isScanning: Boolean = false,
    val showResult: Boolean = false,
    val isLoading: Boolean = false
)