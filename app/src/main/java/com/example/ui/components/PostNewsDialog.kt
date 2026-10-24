package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Image
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun PostNewsDialog(
    onDismiss: () -> Unit,
    onPublish: (title: String, imageUrl: String, content: String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var imageUrl by remember { mutableStateOf("") }
    var content by remember { mutableStateOf("") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val presetImages = listOf(
        "Debate Contest" to "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        "Exam Schedule" to "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
        "Classroom" to "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
        "Library & Study" to "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
        "Graduation" to "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80"
    )

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
                    .verticalScroll(rememberScrollState())
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Post Announcement",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                    }
                }

                Text(
                    text = "Publish updates, events, and notices to the center feed.",
                    fontSize = 12.sp,
                    color = Slate500
                )

                Spacer(modifier = Modifier.height(16.dp))

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

                // Title
                OutlinedTextField(
                    value = title,
                    onValueChange = {
                        title = it
                        errorMessage = null
                    },
                    label = { Text("Article Title", fontSize = 13.sp) },
                    placeholder = { Text("e.g. Cambridge Exam Results Announcement", fontSize = 12.sp) },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Slate300
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Image URL
                OutlinedTextField(
                    value = imageUrl,
                    onValueChange = { imageUrl = it },
                    label = { Text("Photo URL (Optional)", fontSize = 13.sp) },
                    placeholder = { Text("https://images.unsplash.com/...", fontSize = 12.sp) },
                    leadingIcon = {
                        Icon(Icons.Default.Image, contentDescription = null, tint = IndigoPrimary)
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Slate300
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Preset photo chips
                Text("Quick sample photos:", fontSize = 11.sp, color = Slate500, fontWeight = FontWeight.Medium)
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    presetImages.forEach { (label, url) ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (imageUrl == url) IndigoLight else Slate100,
                            border = if (imageUrl == url) androidx.compose.foundation.BorderStroke(1.dp, IndigoPrimary) else null,
                            modifier = Modifier.clickable { imageUrl = url }
                        ) {
                            Text(
                                text = label,
                                fontSize = 11.sp,
                                fontWeight = if (imageUrl == url) FontWeight.Bold else FontWeight.Normal,
                                color = if (imageUrl == url) IndigoPrimary else Slate700,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Content
                OutlinedTextField(
                    value = content,
                    onValueChange = {
                        content = it
                        errorMessage = null
                    },
                    label = { Text("Content", fontSize = 13.sp) },
                    placeholder = { Text("Write news announcement details here...", fontSize = 12.sp) },
                    minLines = 4,
                    maxLines = 8,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = Slate300
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        if (title.isBlank()) {
                            errorMessage = "Please enter an article title"
                            return@Button
                        }
                        if (content.isBlank()) {
                            errorMessage = "Please enter article content"
                            return@Button
                        }
                        val finalImg = if (imageUrl.isNotBlank()) imageUrl.trim() else "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
                        onPublish(title.trim(), finalImg, content.trim())
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    Text("Publish to Center Feed", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                }
            }
        }
    }
}
