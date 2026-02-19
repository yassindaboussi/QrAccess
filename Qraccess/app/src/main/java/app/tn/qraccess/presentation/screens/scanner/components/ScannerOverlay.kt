package app.tn.qraccess.presentation.screens.scanner.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.tn.qraccess.presentation.theme.Primary
import app.tn.qraccess.presentation.theme.PrimaryGlow

@Composable
fun ScannerOverlay(modifier: Modifier = Modifier) {
    val frameSize = 256.dp
    val cornerLen = 48.dp
    val strokeW   = 3.5.dp

    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            val framePx   = frameSize.toPx()
            val centerX   = size.width / 2f
            val centerY   = size.height / 2f
            val left      = centerX - framePx / 2f
            val top       = centerY - framePx / 2f

            // ── Dimmed overlay around frame ────────────────────
            // Top rect
            drawRect(Color.Black.copy(alpha = 0.6f),
                topLeft = Offset(0f, 0f),
                size = Size(size.width, top))
            // Bottom rect
            drawRect(Color.Black.copy(alpha = 0.6f),
                topLeft = Offset(0f, top + framePx),
                size = Size(size.width, size.height - top - framePx))
            // Left rect
            drawRect(Color.Black.copy(alpha = 0.6f),
                topLeft = Offset(0f, top),
                size = Size(left, framePx))
            // Right rect
            drawRect(Color.Black.copy(alpha = 0.6f),
                topLeft = Offset(left + framePx, top),
                size = Size(size.width - left - framePx, framePx))

            // ── Glow behind the frame border ───────────────────
            drawRect(
                brush = Brush.linearGradient(
                    colors = listOf(PrimaryGlow, Color.Transparent, PrimaryGlow),
                ),
                topLeft = Offset(left - 2.dp.toPx(), top - 2.dp.toPx()),
                size = Size(framePx + 4.dp.toPx(), framePx + 4.dp.toPx()),
                style = Stroke(width = 8.dp.toPx())
            )

            // ── Corner brackets ────────────────────────────────
            drawCorners(
                left = left, top = top,
                frameSize = framePx,
                cornerLen = cornerLen.toPx(),
                strokeWidth = strokeW.toPx(),
                color = Primary
            )
        }
    }
}

private fun DrawScope.drawCorners(
    left: Float, top: Float,
    frameSize: Float,
    cornerLen: Float,
    strokeWidth: Float,
    color: Color
) {
    val style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
    val r = left; val b = top; val R = r + frameSize; val B = b + frameSize
    val c = cornerLen

    // Top-left
    drawLine(color, Offset(r, b + c), Offset(r, b), style.width, StrokeCap.Round)
    drawLine(color, Offset(r, b), Offset(r + c, b), style.width, StrokeCap.Round)
    // Top-right
    drawLine(color, Offset(R - c, b), Offset(R, b), style.width, StrokeCap.Round)
    drawLine(color, Offset(R, b), Offset(R, b + c), style.width, StrokeCap.Round)
    // Bottom-left
    drawLine(color, Offset(r, B - c), Offset(r, B), style.width, StrokeCap.Round)
    drawLine(color, Offset(r, B), Offset(r + c, B), style.width, StrokeCap.Round)
    // Bottom-right
    drawLine(color, Offset(R - c, B), Offset(R, B), style.width, StrokeCap.Round)
    drawLine(color, Offset(R, B - c), Offset(R, B), style.width, StrokeCap.Round)
}