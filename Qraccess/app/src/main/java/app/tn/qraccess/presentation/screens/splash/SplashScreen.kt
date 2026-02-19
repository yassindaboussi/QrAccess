package app.tn.qraccess.presentation.screens.splash

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.QrCode2
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
import app.tn.qraccess.presentation.theme.*
import app.tn.qraccess.utils.TokenManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@Composable
fun SplashScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToMain: () -> Unit
) {
    // Check auth after a short delay so the splash is visible
    LaunchedEffect(Unit) {
        withContext(Dispatchers.IO) {
            delay(1200)
            val hasToken = try {
                TokenManager.getAccessToken() != null
            } catch (e: Exception) {
                println("Error checking auth token: ${e.message}")
                false
            }
            withContext(Dispatchers.Main) {
                if (hasToken) onNavigateToMain() else onNavigateToLogin()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Background),
        contentAlignment = Alignment.Center
    ) {
        // ── Ambient glow blobs ─────────────────────────────────
        Box(
            modifier = Modifier
                .size(400.dp)
                .offset(x = (-100).dp, y = (-120).dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Primary.copy(alpha = 0.12f), Color.Transparent)
                    ),
                    CircleShape
                )
        )
        Box(
            modifier = Modifier
                .size(300.dp)
                .align(Alignment.BottomEnd)
                .offset(x = 80.dp, y = 80.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(PrimaryDark.copy(alpha = 0.10f), Color.Transparent)
                    ),
                    CircleShape
                )
        )

        // ── Center content ─────────────────────────────────────
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Logo mark
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Primary, PrimaryDark),
                            start = Offset(0f, 0f),
                            end = Offset(200f, 200f)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Outlined.QrCode2,
                    contentDescription = null,
                    tint = TextOnAccent,
                    modifier = Modifier.size(44.dp)
                )
            }

            // App name + tagline
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "QR Access",
                    style = MaterialTheme.typography.headlineMedium,
                    color = TextPrimary,
                    fontWeight = FontWeight.ExtraBold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Access control, simplified",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Loading indicator
            CircularProgressIndicator(
                modifier = Modifier.size(24.dp),
                color = Primary,
                strokeWidth = 2.5.dp,
                trackColor = SurfaceCard
            )
        }

        // ── Bottom version label ───────────────────────────────
        Text(
            text = "v1.0",
            style = MaterialTheme.typography.labelSmall,
            color = TextTertiary,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 24.dp)
        )
    }
}