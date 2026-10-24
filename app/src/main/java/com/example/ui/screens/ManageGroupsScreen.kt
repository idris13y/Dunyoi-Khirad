package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.GroupData
import com.example.model.Student
import com.example.ui.theme.*

@Composable
fun ManageGroupsScreen(
    groups: Map<String, GroupData>,
    onCreateGroup: (name: String, pass: String, teacher: String) -> Boolean,
    onDeleteGroup: (name: String) -> Unit,
    onOpenGradebook: (name: String) -> Unit,
    showSnackbar: (String) -> Unit
) {
    var newGroupName by remember { mutableStateOf("") }
    var newGroupPass by remember { mutableStateOf("") }
    var newGroupTeacher by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var groupToDelete by remember { mutableStateOf<String?>(null) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Console Header
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Head Teacher Management Console",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Create accounts for new groups. Each group gets its own username and password for parents & teachers.",
                        fontSize = 12.sp,
                        color = Slate500
                    )
                }
            }
        }

        // Register New Group Card
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = IndigoLight,
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Text(
                                text = "➕ Register New Group",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = IndigoPrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    if (errorMessage != null) {
                        Surface(
                            color = RoseLight,
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp)
                        ) {
                            Text(
                                text = errorMessage ?: "",
                                color = RoseDanger,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                            )
                        }
                    }

                    OutlinedTextField(
                        value = newGroupName,
                        onValueChange = {
                            newGroupName = it
                            errorMessage = null
                        },
                        label = { Text("Group Name / Login ID", fontSize = 12.sp) },
                        placeholder = { Text("e.g. Beginners-A, IELTS-FastTrack", fontSize = 12.sp) },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = newGroupPass,
                        onValueChange = {
                            newGroupPass = it
                            errorMessage = null
                        },
                        label = { Text("Assigned Password", fontSize = 12.sp) },
                        placeholder = { Text("Create group password", fontSize = 12.sp) },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = newGroupTeacher,
                        onValueChange = {
                            newGroupTeacher = it
                            errorMessage = null
                        },
                        label = { Text("Teacher's Name", fontSize = 12.sp) },
                        placeholder = { Text("e.g. Mr. David", fontSize = 12.sp) },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            if (newGroupName.isBlank() || newGroupPass.isBlank() || newGroupTeacher.isBlank()) {
                                errorMessage = "All fields are required"
                                return@Button
                            }
                            val success = onCreateGroup(newGroupName.trim(), newGroupPass.trim(), newGroupTeacher.trim())
                            if (success) {
                                newGroupName = ""
                                newGroupPass = ""
                                newGroupTeacher = ""
                                showSnackbar("Group registered successfully!")
                            } else {
                                errorMessage = "A group with this name already exists"
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                    ) {
                        Text("Create Group & Initialize 20 Slots", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color.White)
                    }
                }
            }
        }

        // Active Groups Section
        item {
            Text(
                text = "Active Groups in Center (${groups.size})",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        items(groups.values.toList(), key = { it.name }) { group ->
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = group.name,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = IndigoLight
                            ) {
                                Text(
                                    text = "Teacher: ${group.teacher}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = IndigoPrimary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Password: ", fontSize = 11.sp, color = Slate500)
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Slate100,
                                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200)
                            ) {
                                Text(
                                    text = group.password,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = IndigoPrimary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("• Total Students: ", fontSize = 11.sp, color = Slate500)
                            Text(
                                text = "${group.students.size}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate800
                            )
                        }
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Button(
                            onClick = { onOpenGradebook(group.name) },
                            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            modifier = Modifier.height(36.dp)
                        ) {
                            Text("Open Gradebook", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }

                        Spacer(modifier = Modifier.width(4.dp))

                        IconButton(
                            onClick = { groupToDelete = group.name },
                            modifier = Modifier.size(36.dp)
                        ) {
                            Icon(
                                Icons.Default.Delete,
                                contentDescription = "Delete Group",
                                tint = Slate400,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
        }
    }

    // Delete confirmation
    groupToDelete?.let { gName ->
        AlertDialog(
            onDismissRequest = { groupToDelete = null },
            title = { Text("Delete Group", fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to delete '$gName' and all its student marks?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        onDeleteGroup(gName)
                        groupToDelete = null
                        showSnackbar("Group deleted")
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = RoseDanger)
                ) {
                    Text("Delete", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { groupToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
