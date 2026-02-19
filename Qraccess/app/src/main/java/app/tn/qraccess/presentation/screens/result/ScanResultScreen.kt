package app.tn.qraccess.presentation.screens.result

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import app.tn.qraccess.data.model.ScannedUser
import app.tn.qraccess.data.repository.ScanRepository
import app.tn.qraccess.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScanResultScreen(
    result: ScanRepository.ScanResult?,
    onBackToScan: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Background)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // ── Top bar ───────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onBackToScan,
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceCard)
                ) {
                    Icon(
                        imageVector = Icons.Outlined.ArrowBack,
                        contentDescription = "Back",
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "Scan Result",
                    style = MaterialTheme.typography.titleLarge,
                    color = TextPrimary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // ── Result content ────────────────────────────────
            when (result) {
                is ScanRepository.ScanResult.Granted ->
                    GrantedContent(user = result.user, onBackToScan = onBackToScan)
                is ScanRepository.ScanResult.Denied  ->
                    DeniedContent(user = result.user, reason = result.reason, onBackToScan = onBackToScan)
                is ScanRepository.ScanResult.Error   ->
                    ErrorContent(message = result.message, onBackToScan = onBackToScan)
                is ScanRepository.ScanResult.Loading ->
                    Box(Modifier.fillMaxWidth().padding(top = 120.dp), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Primary)
                    }
                null -> Box(Modifier.fillMaxWidth().padding(top = 120.dp), contentAlignment = Alignment.Center) {
                    Text("No result", color = TextTertiary)
                }
            }
        }
    }
}

// ── GRANTED ──────────────────────────────────────────────────
@Composable
private fun GrantedContent(user: ScannedUser?, onBackToScan: () -> Unit) {
    Column(
        modifier = Modifier.padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Hero banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(
                    Brush.linearGradient(
                        colors = listOf(SuccessBg, Color(0xFF0F3530)),
                        start = Offset(0f, 0f), end = Offset(800f, 600f)
                    )
                )
                .border(1.dp, SuccessBorder, RoundedCornerShape(24.dp))
                .padding(28.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // ✓ icon with glow
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Success.copy(alpha = 0.25f), Color.Transparent)
                            ),
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(60.dp)
                            .clip(CircleShape)
                            .background(Success),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.CheckCircle,
                            contentDescription = null,
                            tint = TextOnAccent,
                            modifier = Modifier.size(34.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Access Granted",
                    style = MaterialTheme.typography.headlineSmall,
                    color = Success,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Success.copy(alpha = 0.15f)
                ) {
                    Text(
                        text = "ACTIVE MEMBER",
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = SuccessLight
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Member details card
        if (user != null) MemberCard(user = user, isGranted = true)

        Spacer(modifier = Modifier.height(24.dp))
        ScanAgainButton(onClick = onBackToScan)
        Spacer(modifier = Modifier.height(32.dp))
    }
}

// ── DENIED ───────────────────────────────────────────────────
@Composable
private fun DeniedContent(user: ScannedUser?, reason: String?, onBackToScan: () -> Unit) {
    Column(
        modifier = Modifier.padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Hero banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(
                    Brush.linearGradient(
                        colors = listOf(ErrorBg, Color(0xFF3A1010)),
                        start = Offset(0f, 0f), end = Offset(800f, 600f)
                    )
                )
                .border(1.dp, ErrorBorder, RoundedCornerShape(24.dp))
                .padding(28.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Error.copy(alpha = 0.25f), Color.Transparent)
                            ),
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(60.dp)
                            .clip(CircleShape)
                            .background(Error),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Cancel,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(34.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Access Denied",
                    style = MaterialTheme.typography.headlineSmall,
                    color = Error,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                // Human-readable reason
                val reasonText = when (reason) {
                    "expired"         -> "Subscription Expired"
                    "not_started"     -> "Subscription Not Started"
                    "no_subscription" -> "No Active Subscription"
                    "invalid_code"    -> "Invalid QR Code"
                    "not_found"       -> "Member Not Found"
                    else              -> reason?.replaceFirstChar { it.uppercase() } ?: "Access Denied"
                }
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Error.copy(alpha = 0.15f)
                ) {
                    Text(
                        text = reasonText.uppercase(),
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = ErrorLight
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
        if (user != null) MemberCard(user = user, isGranted = false)
        Spacer(modifier = Modifier.height(24.dp))
        ScanAgainButton(onClick = onBackToScan)
        Spacer(modifier = Modifier.height(32.dp))
    }
}

// ── ERROR ─────────────────────────────────────────────────────
@Composable
private fun ErrorContent(message: String, onBackToScan: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(WarningBg),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Outlined.Warning, contentDescription = null,
                tint = Warning, modifier = Modifier.size(36.dp))
        }
        Text("Scan Error", style = MaterialTheme.typography.titleLarge,
            color = Warning, fontWeight = FontWeight.Bold)
        Text(message, style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary, textAlign = TextAlign.Center)
        ScanAgainButton(onClick = onBackToScan)
    }
}

// ── Member info card ──────────────────────────────────────────
@Composable
private fun MemberCard(user: ScannedUser, isGranted: Boolean) {
    val accentColor = if (isGranted) Success else Error

    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = SurfaceCard,
        shape = RoundedCornerShape(20.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Border)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            // Card header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Member avatar
                val initials = user.fullName
                    .split(" ")
                    .mapNotNull { it.firstOrNull()?.uppercaseChar() }
                    .take(2)
                    .joinToString("")

                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Primary, PrimaryDark)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(initials, style = MaterialTheme.typography.titleMedium,
                        color = TextOnAccent, fontWeight = FontWeight.Bold)
                }
                Column {
                    Text(user.fullName,
                        style = MaterialTheme.typography.titleMedium,
                        color = TextPrimary)
                    if (user.subscriptionType != null) {
                        Text(user.subscriptionType.replaceFirstChar { it.uppercase() } + " plan",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = Divider)
            Spacer(modifier = Modifier.height(16.dp))

            // Detail rows
            listOf(
                Triple(Icons.Outlined.CalendarMonth, "Start Date", formatDate(user.subscriptionStart)),
                Triple(Icons.Outlined.EventBusy,     "End Date",   formatDate(user.subscriptionEnd)),
                Triple(Icons.Outlined.StickyNote2,       "Notes",      user.subscriptionNotes ?: "No notes"),
                Triple(Icons.Outlined.AccessTime,    "Member Since", formatDate(user.createdAt)),
            ).forEach { (icon, label, value) ->
                DetailRow(icon = { Icon(icon, null, tint = TextTertiary, modifier = Modifier.size(16.dp)) },
                    label = label, value = value)
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

@Composable
private fun DetailRow(
    icon: @Composable () -> Unit,
    label: String,
    value: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Box(modifier = Modifier.padding(top = 2.dp)) { icon() }
        Column(modifier = Modifier.weight(1f)) {
            Text(label, style = MaterialTheme.typography.labelSmall, color = TextTertiary)
            Spacer(modifier = Modifier.height(2.dp))
            Text(value, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
        }
    }
}

@Composable
private fun ScanAgainButton(onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Primary,
            contentColor = TextOnAccent
        ),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
    ) {
        Icon(Icons.Outlined.QrCodeScanner, contentDescription = null,
            modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text("Scan Again", style = MaterialTheme.typography.titleSmall, color = TextOnAccent)
    }
}

private fun formatDate(raw: String?): String {
    if (raw == null) return "N/A"
    return try { raw.split("T").firstOrNull() ?: raw } catch (e: Exception) { raw }
}