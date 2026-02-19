package app.tn.qraccess.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import app.tn.qraccess.presentation.screens.login.LoginScreen
import app.tn.qraccess.presentation.screens.login.LoginViewModel
import app.tn.qraccess.presentation.screens.main.MainScreen
import app.tn.qraccess.presentation.screens.splash.SplashScreen

private object Route {
    const val SPLASH = "splash"
    const val LOGIN  = "login"
    const val MAIN   = "main"
}

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController    = navController,
        startDestination = Route.SPLASH
    ) {

        // ── Splash — auth check ───────────────────────────────
        composable(Route.SPLASH) {
            SplashScreen(
                onNavigateToLogin = {
                    navController.navigate(Route.LOGIN) {
                        popUpTo(Route.SPLASH) { inclusive = true }
                    }
                },
                onNavigateToMain = {
                    navController.navigate(Route.MAIN) {
                        popUpTo(Route.SPLASH) { inclusive = true }
                    }
                }
            )
        }

        // ── Login ─────────────────────────────────────────────
        composable(Route.LOGIN) {
            val loginViewModel: LoginViewModel = viewModel(
                factory = LoginViewModel.provideFactory()
            )
            LoginScreen(
                viewModel      = loginViewModel,
                onLoginSuccess = {
                    navController.navigate(Route.MAIN) {
                        popUpTo(Route.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        // ── Main (scanner + history) ──────────────────────────
        composable(Route.MAIN) {
            MainScreen(
                onLogout = {
                    navController.navigate(Route.LOGIN) {
                        popUpTo(Route.MAIN) { inclusive = true }
                    }
                }
            )
        }
    }
}