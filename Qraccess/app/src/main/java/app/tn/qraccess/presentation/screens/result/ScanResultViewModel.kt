package app.tn.qraccess.presentation.screens.result

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import app.tn.qraccess.data.repository.ScanRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class ScanResultViewModel : ViewModel() {
    private val _scanResult = MutableStateFlow<ScanRepository.ScanResult?>(null)
    val scanResult: StateFlow<ScanRepository.ScanResult?> = _scanResult.asStateFlow()

    fun setScanResult(result: ScanRepository.ScanResult) {
        println("ScanResultViewModel: Setting scan result: $result")
        _scanResult.value = result
    }

    fun clearResult() {
        println("ScanResultViewModel: Clearing scan result")
        _scanResult.value = null
    }

    companion object {
        fun provideFactory(): ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return ScanResultViewModel() as T
            }
        }
    }
}
