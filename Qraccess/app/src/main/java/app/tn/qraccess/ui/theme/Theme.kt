package app.tn.qraccess.presentation.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// We use a single dark-first scheme that looks great.
// The app is intentionally dark — fits a security/access app perfectly.
private val AppColorScheme = darkColorScheme(
    primary              = Primary,
    onPrimary            = TextOnAccent,
    primaryContainer     = PrimaryDark,
    onPrimaryContainer   = PrimaryLight,

    secondary            = Success,
    onSecondary          = TextOnAccent,
    secondaryContainer   = SuccessBg,
    onSecondaryContainer = SuccessLight,

    tertiary             = Warning,
    onTertiary           = TextOnAccent,

    error                = Error,
    onError              = Color.White,
    errorContainer       = ErrorBg,
    onErrorContainer     = ErrorLight,

    background           = Background,
    onBackground         = TextPrimary,

    surface              = Surface,
    onSurface            = TextPrimary,
    surfaceVariant       = SurfaceCard,
    onSurfaceVariant     = TextSecondary,
    surfaceContainerHigh = SurfaceElevated,

    outline              = Border,
    outlineVariant       = Divider,

    inverseSurface       = TextPrimary,
    inverseOnSurface     = Background,
    inversePrimary       = PrimaryDark,
)

@Composable
fun QRAccessTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = AppColorScheme,
        typography  = AppTypography,
        content     = content
    )
}