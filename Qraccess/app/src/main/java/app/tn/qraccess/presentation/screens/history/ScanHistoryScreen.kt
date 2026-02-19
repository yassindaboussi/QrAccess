package app.tn.qraccess.presentation.screens.history

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import app.tn.qraccess.data.model.ScanResult
import app.tn.qraccess.presentation.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun ScanHistoryScreen(
    viewModel: ScanHistoryViewModel = viewModel(factory = ScanHistoryViewModel.provideFactory()),
    onBackToScanner: () -> Unit,
    onLogout: () -> Unit
) {
    val scanHistory by viewModel.scanHistory.collectAsState()
    val isLoading   by viewModel.isLoading.collectAsState()
    val error       by viewModel.error.collectAsState()

    LaunchedEffect(Unit) { viewModel.loadScanHistory() }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {

            // ── Top bar ───────────────────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Surface)
                    .statusBarsPadding()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onBackToScanner) {
                        Icon(Icons.Outlined.ArrowBack, "Back",
                            tint = TextSecondary, modifier = Modifier.size(22.dp))
                    }
                    Text(
                        text = "Scan History",
                        style = MaterialTheme.typography.titleLarge,
                        color = TextPrimary,
                        modifier = Modifier.weight(1f).padding(start = 4.dp)
                    )
                    IconButton(onClick = { viewModel.onLogoutClick(onLogout) }) {
                        Icon(Icons.Outlined.Logout, "Logout",
                            tint = TextSecondary, modifier = Modifier.size(22.dp))
                    }
                }
                // Bottom divider
                Divider(
                    modifier = Modifier.align(Alignment.BottomStart),
                    color = Border, thickness = 1.dp
                )
            }

            // ── Content ───────────────────────────────────────
            when {
                isLoading && scanHistory.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator(color = Primary, strokeWidth = 2.5.dp)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("Loading history…", color = TextSecondary,
                                style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }
                error != null -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(80.dp)
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(SurfaceCard),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Outlined.History, null,
                                    tint = TextTertiary, modifier = Modifier.size(40.dp))
                            }
                            Text("Error loading history", style = MaterialTheme.typography.titleMedium,
                                color = TextPrimary)
                            Text(error ?: "Unknown error occurred",
                                style = MaterialTheme.typography.bodySmall, color = TextTertiary)
                            
                            Button(
                                onClick = { viewModel.refreshScanHistory() },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Primary,
                                    contentColor = TextOnAccent
                                )
                            ) {
                                Text("Retry", style = MaterialTheme.typography.labelMedium)
                            }
                        }
                    }
                }
                scanHistory.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(80.dp)
                                    .clip(RoundedCornerShape(24.dp))
                                    .background(SurfaceCard),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Outlined.History, null,
                                    tint = TextTertiary, modifier = Modifier.size(40.dp))
                            }
                            Text("No scan history yet", style = MaterialTheme.typography.titleMedium,
                                color = TextPrimary)
                            Text("Scans will appear here once made",
                                style = MaterialTheme.typography.bodySmall, color = TextTertiary)
                        }
                    }
                }
                else -> {
                    // ── Summary strip ──────────────────────────
                    val grantedCount = scanHistory.count { it.status == "granted" }
                    val deniedCount  = scanHistory.size - grantedCount

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        SummaryChip(
                            label = "Granted",
                            count = grantedCount,
                            color = Success,
                            bg = SuccessBg,
                            modifier = Modifier.weight(1f)
                        )
                        SummaryChip(
                            label = "Denied",
                            count = deniedCount,
                            color = Error,
                            bg = ErrorBg,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(
                            start = 16.dp, end = 16.dp, bottom = 32.dp
                        ),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        itemsIndexed(scanHistory) { index, scan ->
                            // Load more when reaching near the end
                            if (index == scanHistory.size - 3 && !isLoading) {
                                LaunchedEffect(Unit) {
                                    viewModel.loadMoreScans()
                                }
                            }
                            ScanHistoryCard(scan)
                        }
                        
                        // Loading indicator at bottom when loading more
                        if (isLoading && scanHistory.isNotEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(16.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    CircularProgressIndicator(
                                        color = Primary,
                                        strokeWidth = 2.dp,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ── Summary chip ──────────────────────────────────────────────
@Composable
private fun SummaryChip(
    label: String,
    count: Int,
    color: Color,
    bg: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        color = bg,
        shape = RoundedCornerShape(14.dp),
        border = androidx.compose.foundation.BorderStroke(
            1.dp, color.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(modifier = Modifier
                .size(8.dp).clip(CircleShape).background(color))
            Text(label, style = MaterialTheme.typography.labelMedium, color = color)
            Spacer(modifier = Modifier.weight(1f))
            Text(count.toString(),
                style = MaterialTheme.typography.titleSmall,
                color = color, fontWeight = FontWeight.Bold)
        }
    }
}

// ── History card ──────────────────────────────────────────────
@Composable
private fun ScanHistoryCard(scan: ScanResult) {
    val isGranted   = scan.status == "granted"
    val accentColor = if (isGranted) Success else Error
    val accentBg    = if (isGranted) SuccessBg else ErrorBg

    // Format the timestamp for display
    val dateFormat  = remember { SimpleDateFormat("MMM dd · HH:mm", Locale.getDefault()) }
    val displayTime = scan.user?.createdAt?.let { 
        try {
            val timestamp = it.toLongOrNull()
            timestamp?.let { dateFormat.format(Date(it)) } ?: "—"
        } catch (e: Exception) {
            "—"
        }
    } ?: "—"

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = SurfaceCard,
        shape = RoundedCornerShape(18.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Border)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // ── Status icon ────────────────────────────────────
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(13.dp))
                    .background(accentBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isGranted) Icons.Outlined.CheckCircle else Icons.Outlined.Cancel,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(22.dp)
                )
            }

            // ── Info ───────────────────────────────────────────
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = scan.user?.fullName ?: "Unknown Member",
                    style = MaterialTheme.typography.titleSmall,
                    color = TextPrimary,
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(3.dp))

                val reasonText = when (scan.reason ?: scan.message) {
                    "active"          -> "Active subscription"
                    "expired"         -> "Subscription expired"
                    "not_started"     -> "Not started yet"
                    "no_subscription" -> "No subscription"
                    "invalid_code"    -> "Invalid QR code"
                    "not_found"       -> "User not found"
                    "system_error"    -> "System error"
                    else -> (scan.reason ?: scan.message ?: "—")
                        .replaceFirstChar { it.uppercase() }
                }
                Text(
                    text = reasonText,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    maxLines = 1
                )
            }

            // ── Right side — time + badge ──────────────────────
            Column(horizontalAlignment = Alignment.End) {
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = accentBg
                ) {
                    Text(
                        text = if (isGranted) "GRANTED" else "DENIED",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = accentColor,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = displayTime,
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary
                )
            }
        }
    }
}