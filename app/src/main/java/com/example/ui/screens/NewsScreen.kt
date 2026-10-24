package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.model.NewsItem
import com.example.model.UserSession
import com.example.ui.theme.*

@Composable
fun NewsScreen(
    newsList: List<NewsItem>,
    currentUser: UserSession?,
    onPostNewsClick: () -> Unit,
    onDeleteNews: (id: String) -> Unit
) {
    var itemToDelete by remember { mutableStateOf<NewsItem?>(null) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header Banner
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Center Announcements & News",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Updates, events, and latest notices from Apex Educational Center.",
                                fontSize = 12.sp,
                                color = Slate500
                            )
                        }

                        if (currentUser?.isAdmin == true) {
                            Spacer(modifier = Modifier.width(12.dp))
                            Button(
                                onClick = onPostNewsClick,
                                colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                                shape = RoundedCornerShape(12.dp),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Post News", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // News items list
        if (newsList.isEmpty()) {
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surface,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Newspaper,
                            contentDescription = null,
                            tint = Slate400,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("No announcements yet", fontWeight = FontWeight.SemiBold, color = Slate700)
                    }
                }
            }
        } else {
            items(newsList, key = { it.id }) { item ->
                NewsCard(
                    item = item,
                    isAdmin = currentUser?.isAdmin == true,
                    onDelete = { itemToDelete = item }
                )
            }
        }
    }

    // Delete confirmation dialog
    if (itemToDelete != null) {
        AlertDialog(
            onDismissRequest = { itemToDelete = null },
            title = { Text("Delete Announcement", fontWeight = FontWeight.Bold) },
            text = { Text("Are you sure you want to delete '${itemToDelete?.title}'?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        itemToDelete?.let { onDeleteNews(it.id) }
                        itemToDelete = null
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = RoseDanger)
                ) {
                    Text("Delete", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { itemToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun NewsCard(
    item: NewsItem,
    isAdmin: Boolean,
    onDelete: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            // Image
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .background(Slate100)
            ) {
                AsyncImage(
                    model = item.imageUrl,
                    contentDescription = item.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                if (isAdmin) {
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .background(Color.White.copy(alpha = 0.9f), RoundedCornerShape(8.dp))
                            .size(36.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = RoseDanger,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            // Text info
            Column(
                modifier = Modifier.padding(18.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(bottom = 6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CalendarToday,
                        contentDescription = null,
                        tint = IndigoPrimary,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = item.date,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = IndigoPrimary
                    )
                }

                Text(
                    text = item.title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 22.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = item.content,
                    fontSize = 13.sp,
                    color = Slate600,
                    lineHeight = 19.sp
                )
            }
        }
    }
}
