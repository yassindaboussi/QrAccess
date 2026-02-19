package app.tn.qraccess.presentation.screens.main

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.QrCodeScanner
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import app.tn.qraccess.presentation.screens.history.ScanHistoryScreen
import app.tn.qraccess.presentation.screens.history.ScanHistoryViewModel
import app.tn.qraccess.presentation.screens.result.ScanResultScreen
import app.tn.qraccess.presentation.screens.result.ScanResultViewModel
import app.tn.qraccess.presentation.screens.scanner.ScannerScreen
import app.tn.qraccess.presentation.screens.scanner.ScannerViewModel
import app.tn.qraccess.presentation.theme.*

sealed class BottomNavItem(
    val route: String,
    val title: String,
    val icon: ImageVector,
    val iconSelected: ImageVector
) {
    object Scanner : BottomNavItem(
        "scanner", "Scanner",
        Icons.Outlined.QrCodeScanner, Icons.Filled.QrCodeScanner
    )
    object History : BottomNavItem(
        "history", "History",
        Icons.Outlined.History, Icons.Filled.History
    )
}

@Composable
fun MainScreen(onLogout: () -> Unit) {
    val navController    = rememberNavController()
    val navBackStack     by navController.currentBackStackEntryAsState()
    val currentRoute     = navBackStack?.destination?.route

    val sharedResultViewModel: ScanResultViewModel = viewModel(
        factory = ScanResultViewModel.provideFactory()
    )

    val bottomNavItems = listOf(BottomNavItem.Scanner, BottomNavItem.History)

    Scaffold(
        containerColor = Background,
        bottomBar = {
            // Only show bottom bar on main tabs (not on scan_result)
            if (currentRoute in bottomNavItems.map { it.route }) {
                NavigationBar(
                    containerColor = NavBar,
                    tonalElevation = 0.dp,
                    modifier = Modifier.navigationBarsPadding()
                ) {
                    bottomNavItems.forEach { item ->
                        val selected = currentRoute == item.route
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState    = true
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = if (selected) item.iconSelected else item.icon,
                                    contentDescription = item.title,
                                    modifier = Modifier.size(24.dp)
                                )
                            },
                            label = {
                                Text(
                                    text  = item.title,
                                    style = MaterialTheme.typography.labelMedium
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor   = NavBarSelected,
                                selectedTextColor   = NavBarSelected,
                                unselectedIconColor = NavBarUnsel,
                                unselectedTextColor = NavBarUnsel,
                                indicatorColor      = Primary.copy(alpha = 0.15f)
                            )
                        )
                    }
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController    = navController,
            startDestination = BottomNavItem.Scanner.route,
            modifier         = Modifier.padding(paddingValues)
        ) {
            composable(BottomNavItem.Scanner.route) {
                val vm: ScannerViewModel = viewModel(factory = ScannerViewModel.provideFactory())
                ScannerScreen(
                    viewModel = vm,
                    onLogout  = onLogout,
                    onScanResult = { result ->
                        sharedResultViewModel.setScanResult(result)
                        navController.navigate("scan_result")
                    }
                )
            }

            composable(BottomNavItem.History.route) {
                val vm: ScanHistoryViewModel = viewModel(factory = ScanHistoryViewModel.provideFactory())
                ScanHistoryScreen(
                    viewModel       = vm,
                    onBackToScanner = {
                        navController.navigate(BottomNavItem.Scanner.route) {
                            popUpTo(BottomNavItem.Scanner.route) { inclusive = true }
                        }
                    },
                    onLogout = onLogout
                )
            }

            composable("scan_result") {
                val result by sharedResultViewModel.scanResult.collectAsStateWithLifecycle()
                ScanResultScreen(
                    result       = result,
                    onBackToScan = {
                        navController.navigate(BottomNavItem.Scanner.route) {
                            popUpTo("scan_result") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}