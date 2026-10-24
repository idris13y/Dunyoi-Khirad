package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.ui.theme.*

@Composable
fun AuthDialog(
    onDismiss: () -> Unit,
    onLogin: (username: String, pass: String) -> Boolean
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp,
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .fillMaxWidth()
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Sign In to Portal",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Parents, Teachers & Administrators",
                            fontSize = 12.sp,
                            color = Slate500
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = Slate400
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Error message
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
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                        )
                    }
                }

                // Username field
                OutlinedTextField(
                    value = username,
                    onValueChange = {
                        username = it
                        errorMessage = null
                    },
                    label = { Text("Username / Group ID", fontSize = 13.sp) },
                    placeholder = { Text("e.g. Upper-intermediate or admin", fontSize = 12.sp) },
                    leadingIcon = {
                        Icon(Icons.Default.Person, contentDescription = null, tint = IndigoPrimary)
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Slate300
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Password field
                OutlinedTextField(
                    value = password,
                    onValueChange = {
                        password = it
                        errorMessage = null
                    },
                    label = { Text("Password", fontSize = 13.sp) },
                    placeholder = { Text("••••••••", fontSize = 12.sp) },
                    leadingIcon = {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = IndigoPrimary)
                    },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                contentDescription = if (passwordVisible) "Hide password" else "Show password",
                                tint = Slate400
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Slate300
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(18.dp))

                Button(
                    onClick = {
                        val success = onLogin(username.trim(), password.trim())
                        if (!success) {
                            errorMessage = "Invalid username or password"
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    Text("Sign In", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Quick credentials helper box
                Surface(
                    color = Slate50,
                    shape = RoundedCornerShape(14.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = "Quick Credentials to Test:",
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp,
                            color = Slate800
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        // Admin quick row
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(IndigoLight.copy(alpha = 0.5f))
                                .clickable {
                                    username = "admin"
                                    password = "@idrisyorov1313@"
                                    errorMessage = null
                                }
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("👑 Admin", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Slate900)
                                Text("admin / @idrisyorov1313@", fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = IndigoPrimary)
                            }
                            Text("Auto-fill", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = IndigoPrimary)
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        // Sample Group quick row
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(Slate100)
                                .clickable {
                                    username = "Upper-intermediate"
                                    password = "upper123"
                                    errorMessage = null
                                }
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("👨‍👩‍👧 Sample Group", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Slate900)
                                Text("Upper-intermediate / upper123", fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = IndigoPrimary)
                            }
                            Text("Auto-fill", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = IndigoPrimary)
                        }
                    }
                }
            }
        }
    }
}
