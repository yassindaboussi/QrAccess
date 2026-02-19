package app.tn.qraccess.presentation.screens.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import app.tn.qraccess.data.model.ScanResult
import app.tn.qraccess.data.repository.AuthRepository
import app.tn.qraccess.data.repository.ScanRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ScanHistoryViewModel(
    private val scanRepository: ScanRepository = ScanRepository(),
    private val authRepository: AuthRepository = AuthRepository()
) : ViewModel() {

    private val _scanHistory = MutableStateFlow<List<ScanResult>>(emptyList())
    val scanHistory: StateFlow<List<ScanResult>> = _scanHistory.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _totalScans = MutableStateFlow(0)
    val totalScans: StateFlow<Int> = _totalScans.asStateFlow()

    private var currentPage = 1
    private val pageSize = 50

    fun loadScanHistory() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            try {
                when (val result = scanRepository.getScanHistory(
                    page = currentPage,
                    limit = pageSize
                )) {
                    is ScanRepository.HistoryResult.Success -> {
                        _scanHistory.value = result.scans
                        _totalScans.value = result.total
                    }
                    is ScanRepository.HistoryResult.Error -> {
                        _error.value = result.message
                    }
                    is ScanRepository.HistoryResult.Loading -> {
                        // Already handled by _isLoading
                    }
                }
            } catch (e: Exception) {
                _error.value = "Failed to load scan history: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun loadMoreScans() {
        if (_isLoading.value) return
        
        viewModelScope.launch {
            _isLoading.value = true
            
            try {
                currentPage++
                when (val result = scanRepository.getScanHistory(
                    page = currentPage,
                    limit = pageSize
                )) {
                    is ScanRepository.HistoryResult.Success -> {
                        _scanHistory.value = _scanHistory.value + result.scans
                        _totalScans.value = result.total
                    }
                    is ScanRepository.HistoryResult.Error -> {
                        _error.value = result.message
                        currentPage-- // Revert page increment on error
                    }
                    is ScanRepository.HistoryResult.Loading -> {
                        // Already handled by _isLoading
                    }
                }
            } catch (e: Exception) {
                _error.value = "Failed to load more scans: ${e.message}"
                currentPage-- // Revert page increment on error
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun refreshScanHistory() {
        currentPage = 1
        loadScanHistory()
    }

    fun clearError() {
        _error.value = null
    }

    fun onLogoutClick(onLogout: () -> Unit) {
        viewModelScope.launch {
            _isLoading.value = true

            val result = authRepository.logout()

            _isLoading.value = false

            if (result is AuthRepository.AuthResult.Success) {
                onLogout()
            }
        }
    }

    companion object {
        fun provideFactory(): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    if (modelClass.isAssignableFrom(ScanHistoryViewModel::class.java)) {
                        return ScanHistoryViewModel() as T
                    }
                    throw IllegalArgumentException("Unknown ViewModel class")
                }
            }
        }
    }
}
