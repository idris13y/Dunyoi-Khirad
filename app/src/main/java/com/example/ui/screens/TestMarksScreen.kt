package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.model.GroupData
import com.example.model.Student
import com.example.model.UserSession
import com.example.ui.components.UnauthorizedCard
import com.example.ui.theme.*

@Composable
fun TestMarksScreen(
    currentUser: UserSession?,
    activeGroup: String?,
    allGroups: Map<String, GroupData>,
    onGroupSelected: (String) -> Unit,
    onSaveMarks: (String, List<Student>) -> Unit,
    onSignInClick: () -> Unit,
    showSnackbar: (String) -> Unit
) {
    if (currentUser == null) {
        UnauthorizedCard(onSignInClick = onSignInClick)
        return
    }

    val currentGroupName = activeGroup ?: currentUser.username
    val groupData = allGroups[currentGroupName]

    var studentsList by remember(currentGroupName, groupData) {
        mutableStateOf<List<Student>>(groupData?.students ?: emptyList())
    }

    var studentToEditName by remember { mutableStateOf<Pair<Int, String>?>(null) }
    var studentToDelete by remember { mutableStateOf<Int?>(null) }
    var groupDropdownExpanded by remember { mutableStateOf(false) }

    val testHeaders = listOf("Quiz 1", "Test 1", "Midterm", "Test 2", "Final")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        // Top Header Card
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = AmberLight,
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Text(
                                text = "Examinations",
                                color = AmberWarning,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }

                        // Group switcher for Head Teacher
                        if (currentUser.isAdmin && allGroups.isNotEmpty()) {
                            Box {
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Slate100,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate300),
                                    modifier = Modifier.clickable { groupDropdownExpanded = true }
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = "Group: $currentGroupName",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Slate800
                                        )
                                        Icon(
                                            Icons.Default.ArrowDropDown,
                                            contentDescription = "Select Group",
                                            modifier = Modifier.size(16.dp),
                                            tint = Slate600
                                        )
                                    }
                                }

                                DropdownMenu(
                                    expanded = groupDropdownExpanded,
                                    onDismissRequest = { groupDropdownExpanded = false }
                                ) {
                                    allGroups.keys.forEach { gName ->
                                        DropdownMenuItem(
                                            text = {
                                                Text(
                                                    gName,
                                                    fontWeight = if (gName == currentGroupName) FontWeight.Bold else FontWeight.Normal,
                                                    color = if (gName == currentGroupName) IndigoPrimary else Slate800
                                                )
                                            },
                                            onClick = {
                                                onGroupSelected(gName)
                                                groupDropdownExpanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        } else {
                            Text(
                                text = "Group: $currentGroupName",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Slate600
                            )
                        }
                    }

                    Text(
                        text = "${studentsList.size}/20 Students",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate500
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Official Test & Exam Marks",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "Record periodic tests, midterms, and final exam performance.",
                    fontSize = 11.sp,
                    color = Slate500
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Actions row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(
                        onClick = {
                            if (studentsList.size >= 20) {
                                showSnackbar("Maximum limit of 20 students reached!")
                                return@OutlinedButton
                            }
                            studentsList = studentsList + Student(
                                name = "New Student ${studentsList.size + 1}",
                                lessons = List(13) { "" },
                                tests = List(5) { "" }
                            )
                            showSnackbar("Added new student slot")
                        },
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        modifier = Modifier.height(38.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("+ Add Student", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Button(
                        onClick = {
                            onSaveMarks(currentGroupName, studentsList)
                            showSnackbar("Test marks saved successfully!")
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                        modifier = Modifier.height(38.dp)
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Save Test Marks", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Table Container
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            val horizontalScrollState = rememberScrollState()

            Column(modifier = Modifier.fillMaxSize()) {
                // Table Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate100)
                        .horizontalScroll(horizontalScrollState)
                        .padding(vertical = 10.dp, horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("#", modifier = Modifier.width(32.dp), textAlign = TextAlign.Center, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Slate700)
                    Text("Student Full Name", modifier = Modifier.width(170.dp), fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Slate700)
                    testHeaders.forEach { header ->
                        Text(header, modifier = Modifier.width(72.dp), textAlign = TextAlign.Center, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Slate700)
                    }
                    Text("Total Score", modifier = Modifier.width(84.dp), textAlign = TextAlign.Center, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = AmberWarning)
                    Text("Del", modifier = Modifier.width(36.dp), textAlign = TextAlign.Center, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Slate700)
                }

                HorizontalDivider(color = Slate200)

                if (studentsList.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No students in this group yet. Click '+ Add Student' above.",
                            color = Slate400,
                            fontSize = 13.sp
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f)
                    ) {
                        itemsIndexed(
                            items = studentsList,
                            key = { _, item -> item.id }
                        ) { index, student ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .horizontalScroll(horizontalScrollState)
                                    .padding(vertical = 6.dp, horizontal = 8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Index
                                Text(
                                    text = "${index + 1}",
                                    modifier = Modifier.width(32.dp),
                                    textAlign = TextAlign.Center,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate400
                                )

                                // Name
                                Row(
                                    modifier = Modifier
                                        .width(170.dp)
                                        .clip(RoundedCornerShape(6.dp))
                                        .clickable { studentToEditName = Pair(index, student.name) }
                                        .padding(horizontal = 4.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = student.name.ifBlank { "Tap to set name..." },
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = if (student.name.isBlank()) Slate400 else Slate900,
                                        maxLines = 1,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Icon(
                                        Icons.Default.Edit,
                                        contentDescription = "Edit name",
                                        tint = Slate400,
                                        modifier = Modifier.size(12.dp)
                                    )
                                }

                                // 5 Test inputs
                                for (t in 0 until 5) {
                                    val testVal = student.tests.getOrNull(t) ?: ""
                                    Box(
                                        modifier = Modifier
                                            .width(72.dp)
                                            .padding(horizontal = 4.dp)
                                    ) {
                                        OutlinedTextField(
                                            value = testVal,
                                            onValueChange = { newVal ->
                                                if (newVal.length <= 3) {
                                                    val updatedTests = student.tests.toMutableList()
                                                    while (updatedTests.size < 5) {
                                                        updatedTests.add("")
                                                    }
                                                    updatedTests[t] = newVal
                                                    val updatedList = studentsList.toMutableList()
                                                    updatedList[index] = student.copy(tests = updatedTests)
                                                    studentsList = updatedList
                                                }
                                            },
                                            singleLine = true,
                                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                            textStyle = LocalTextStyle.current.copy(
                                                fontSize = 11.sp,
                                                textAlign = TextAlign.Center,
                                                fontWeight = FontWeight.Bold
                                            ),
                                            placeholder = {
                                                Text("0-100", fontSize = 10.sp, color = Slate400, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
                                            },
                                            colors = OutlinedTextFieldDefaults.colors(
                                                focusedBorderColor = AmberWarning,
                                                unfocusedBorderColor = Slate200,
                                                focusedContainerColor = AmberLight.copy(alpha = 0.3f),
                                                unfocusedContainerColor = Color.White
                                            ),
                                            shape = RoundedCornerShape(6.dp),
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(48.dp)
                                        )
                                    }
                                }

                                // Total Score Column
                                val total = student.calculateTestAverage()
                                Box(
                                    modifier = Modifier
                                        .width(84.dp)
                                        .padding(horizontal = 4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = AmberLight
                                    ) {
                                        Text(
                                            text = total,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = AmberWarning,
                                            textAlign = TextAlign.Center,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }

                                // Delete Student Column
                                IconButton(
                                    onClick = { studentToDelete = index },
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Close,
                                        contentDescription = "Remove student",
                                        tint = Slate300,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                            HorizontalDivider(color = Slate100)
                        }
                    }
                }
            }
        }
    }

    // Edit Name Dialog
    studentToEditName?.let { (idx, initialName) ->
        var currentEditingName by remember { mutableStateOf(initialName) }

        Dialog(onDismissRequest = { studentToEditName = null }) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface,
                modifier = Modifier.padding(16.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Edit Student Name", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = currentEditingName,
                        onValueChange = { currentEditingName = it },
                        singleLine = true,
                        label = { Text("Full Name") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        TextButton(onClick = { studentToEditName = null }) {
                            Text("Cancel")
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                val updatedList = studentsList.toMutableList()
                                updatedList[idx] = updatedList[idx].copy(name = currentEditingName.trim())
                                studentsList = updatedList
                                studentToEditName = null
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)
                        ) {
                            Text("Done")
                        }
                    }
                }
            }
        }
    }

    // Delete Student Confirmation
    studentToDelete?.let { idx ->
        val s = studentsList.getOrNull(idx)
        AlertDialog(
            onDismissRequest = { studentToDelete = null },
            title = { Text("Remove Student", fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to remove '${s?.name?.ifBlank { "this student" }}' from this group?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        val updatedList = studentsList.toMutableList()
                        updatedList.removeAt(idx)
                        studentsList = updatedList
                        studentToDelete = null
                        showSnackbar("Student removed")
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = RoseDanger)
                ) {
                    Text("Remove", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { studentToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
