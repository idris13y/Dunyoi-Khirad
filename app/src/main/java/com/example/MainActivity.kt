package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.DataManager
import com.example.model.GroupData
import com.example.model.NewsItem
import com.example.model.Student
import com.example.model.UserSession
import com.example.ui.components.AuthDialog
import com.example.ui.components.PostNewsDialog
import com.example.ui.screens.AboutUsScreen
import com.example.ui.screens.LessonMarksScreen
import com.example.ui.screens.ManageGroupsScreen
import com.example.ui.screens.NewsScreen
import com.example.ui.screens.TestMarksScreen
import com.example.ui.theme.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

enum class PortalTab(val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    NEWS("News & Notices", Icons.Default.Newspaper),
    LESSONS("Lesson Marks (1-13)", Icons.Default.EditNote),
    TESTS("Test Marks", Icons.Default.Assessment),
    ABOUT("About Us", Icons.Default.Info),
    ADMIN("Manage Groups", Icons.Default.Settings)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                AcademicPortalApp(context = this)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AcademicPortalApp(context: android.content.Context) {
    val dataManager = remember { DataManager(context) }
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    var groups by remember { mutableStateOf(dataManager.loadGroups()) }
    var newsList by remember { mutableStateOf(dataManager.loadNews()) }
    var currentUser by remember { mutableStateOf(dataManager.loadSession()) }

    var selectedTab by remember { mutableStateOf(PortalTab.NEWS) }
    var activeGroup by remember {
        mutableStateOf(
            currentUser?.let { if (it.isAdmin) groups.keys.firstOrNull() ?: "Upper-intermediate" else it.username }
                ?: (groups.keys.firstOrNull() ?: "Upper-intermediate")
        )
    }

    var showAuthModal by remember { mutableStateOf(false) }
    var showPostNewsModal by remember { mutableStateOf(false) }

    fun showMessage(msg: String) {
        scope.launch {
            snackbarHostState.showSnackbar(msg)
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                ) {
                    // Main Header Row
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Logo & Title
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.clickable { selectedTab = PortalTab.NEWS }
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(
                                        Brush.linearGradient(
                                            listOf(IndigoPrimary, VioletAccent)
                                        )
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.School,
                                    contentDescription = "Logo",
                                    tint = Color.White,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Dunyoi Khirad",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    lineHeight = 20.sp
                                )
                                Text(
                                    text = "EDUCATIONAL CENTER",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = IndigoPrimary,
                                    letterSpacing = 1.sp
                                )
                            }
                        }

                        // Auth Actions / User Badge
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (currentUser != null) {
                                Column(
                                    horizontalAlignment = Alignment.End,
                                    modifier = Modifier.padding(end = 8.dp)
                                ) {
                                    Text(
                                        text = "Logged in as:",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Slate500
                                    )
                                    Text(
                                        text = currentUser!!.displayName,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = IndigoPrimary
                                    )
                                }

                                OutlinedButton(
                                    onClick = {
                                        currentUser = null
                                        dataManager.saveSession(null)
                                        selectedTab = PortalTab.NEWS
                                        showMessage("Signed out successfully")
                                    },
                                    shape = RoundedCornerShape(10.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    modifier = Modifier.height(34.dp)
                                ) {
                                    Text("Log Out", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate700)
                                }
                            } else {
                                Button(
                                    onClick = { showAuthModal = true },
                                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                                    shape = RoundedCornerShape(10.dp),
                                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                                    modifier = Modifier.height(36.dp)
                                ) {
                                    Text("Sign In", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        }
                    }

                    // Navigation Tabs Row
                    val availableTabs = mutableListOf(PortalTab.NEWS, PortalTab.LESSONS, PortalTab.TESTS, PortalTab.ABOUT)
                    if (currentUser?.isAdmin == true) {
                        availableTabs.add(PortalTab.ADMIN)
                    }

                    ScrollableTabRow(
                        selectedTabIndex = availableTabs.indexOf(selectedTab).coerceAtLeast(0),
                        edgePadding = 12.dp,
                        containerColor = MaterialTheme.colorScheme.surface,
                        contentColor = IndigoPrimary,
                        divider = {}
                    ) {
                        availableTabs.forEach { tab ->
                            val isSelected = selectedTab == tab
                            Tab(
                                selected = isSelected,
                                onClick = { selectedTab = tab },
                                text = {
                                    Text(
                                        text = tab.label,
                                        fontSize = 12.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
                                        color = if (isSelected) IndigoPrimary else Slate600
                                    )
                                },
                                icon = {
                                    Icon(
                                        imageVector = tab.icon,
                                        contentDescription = tab.label,
                                        modifier = Modifier.size(18.dp),
                                        tint = if (isSelected) IndigoPrimary else Slate400
                                    )
                                }
                            )
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Slate50)
        ) {
            when (selectedTab) {
                PortalTab.NEWS -> {
                    NewsScreen(
                        newsList = newsList,
                        currentUser = currentUser,
                        onPostNewsClick = { showPostNewsModal = true },
                        onDeleteNews = { id ->
                            scope.launch {
                                dataManager.deleteNews(id)
                                newsList = dataManager.loadNews()
                                showMessage("Announcement deleted")
                            }
                        }
                    )
                }

                PortalTab.LESSONS -> {
                    LessonMarksScreen(
                        currentUser = currentUser,
                        activeGroup = activeGroup,
                        allGroups = groups,
                        onGroupSelected = { activeGroup = it },
                        onSaveMarks = { groupName, updatedStudents ->
                            scope.launch {
                                dataManager.saveStudentsForGroup(groupName, updatedStudents)
                                val group = groups[groupName]
                                if (group != null) {
                                    val updatedMap = groups.toMutableMap()
                                    updatedMap[groupName] = group.copy(students = updatedStudents)
                                    groups = updatedMap
                                }
                            }
                        },
                        onSignInClick = { showAuthModal = true },
                        showSnackbar = { showMessage(it) }
                    )
                }

                PortalTab.TESTS -> {
                    TestMarksScreen(
                        currentUser = currentUser,
                        activeGroup = activeGroup,
                        allGroups = groups,
                        onGroupSelected = { activeGroup = it },
                        onSaveMarks = { groupName, updatedStudents ->
                            scope.launch {
                                dataManager.saveStudentsForGroup(groupName, updatedStudents)
                                val group = groups[groupName]
                                if (group != null) {
                                    val updatedMap = groups.toMutableMap()
                                    updatedMap[groupName] = group.copy(students = updatedStudents)
                                    groups = updatedMap
                                }
                            }
                        },
                        onSignInClick = { showAuthModal = true },
                        showSnackbar = { showMessage(it) }
                    )
                }

                PortalTab.ABOUT -> {
                    AboutUsScreen()
                }

                PortalTab.ADMIN -> {
                    if (currentUser?.isAdmin == true) {
                        ManageGroupsScreen(
                            groups = groups,
                            onCreateGroup = { name, pass, teacher ->
                                if (groups.containsKey(name)) {
                                    false
                                } else {
                                    scope.launch {
                                        dataManager.createGroup(name, pass, teacher)
                                        groups = dataManager.loadGroups()
                                    }
                                    true
                                }
                            },
                            onDeleteGroup = { name ->
                                scope.launch {
                                    dataManager.deleteGroup(name)
                                    groups = dataManager.loadGroups()
                                    if (activeGroup == name) {
                                        activeGroup = groups.keys.firstOrNull() ?: ""
                                    }
                                }
                            },
                            onOpenGradebook = { name ->
                                activeGroup = name
                                selectedTab = PortalTab.LESSONS
                            },
                            showSnackbar = { showMessage(it) }
                        )
                    } else {
                        selectedTab = PortalTab.NEWS
                    }
                }
            }
        }
    }

    // Sign In Modal
    if (showAuthModal) {
        AuthDialog(
            onDismiss = { showAuthModal = false },
            onLogin = { username, password ->
                // Check Admin Account
                if (username == DataManager.ADMIN_USER && password == DataManager.ADMIN_PASS) {
                    val session = UserSession(username = username, role = "admin", displayName = "Admin")
                    currentUser = session
                    dataManager.saveSession(session)
                    activeGroup = groups.keys.firstOrNull() ?: "Upper-intermediate"
                    showAuthModal = false
                    selectedTab = PortalTab.LESSONS
                    showMessage("Welcome back, Admin!")
                    true
                } else if (groups.containsKey(username) && groups[username]?.password == password) {
                    // Check Group Account
                    val session = UserSession(username = username, role = "group", displayName = "Group: $username")
                    currentUser = session
                    dataManager.saveSession(session)
                    activeGroup = username
                    showAuthModal = false
                    selectedTab = PortalTab.LESSONS
                    showMessage("Signed in as Group $username")
                    true
                } else {
                    false
                }
            }
        )
    }

    // Post News Modal
    if (showPostNewsModal) {
        PostNewsDialog(
            onDismiss = { showPostNewsModal = false },
            onPublish = { title, imageUrl, content ->
                val dateFormat = SimpleDateFormat("MMMM d, yyyy", Locale.US)
                val newItem = NewsItem(
                    title = title,
                    date = dateFormat.format(Date()),
                    imageUrl = imageUrl,
                    content = content
                )
                scope.launch {
                    dataManager.addNews(newItem)
                    newsList = dataManager.loadNews()
                    showPostNewsModal = false
                    showMessage("Announcement published to feed!")
                }
            }
        )
    }
}
