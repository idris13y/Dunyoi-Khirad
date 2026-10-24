package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.*

@Composable
fun AboutUsScreen() {
    var photoUrl by remember {
        mutableStateOf("https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80")
    }
    var photoCaption by remember {
        mutableStateOf("Main Educational Campus & Administrative Headquarters of Dunyoi Khirad LLC")
    }
    var showPhotoDialog by remember { mutableStateOf(false) }
    var tempUrlInput by remember { mutableStateOf(photoUrl) }
    var tempCaptionInput by remember { mutableStateOf(photoCaption) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Hero Banner
        item {
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                listOf(IndigoPrimary, Slate900)
                            )
                        )
                        .padding(22.dp)
                ) {
                    Column {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color.White.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = "🏛️ Licensed LLC",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = AmberWarning.copy(alpha = 0.25f)
                            ) {
                                Text(
                                    text = "№ ED-2023-TJ-94812",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = AmberWarning,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = "ҶДММ \"Дунёи Хирад\"",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White
                        )
                        Text(
                            text = "Dunyoi Khirad Educational Center LLC",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = VioletAccent
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Nurturing intellectual mastery, multilingual fluency, and high-impact university preparation through disciplined continuous assessment and modern pedagogy.",
                            fontSize = 12.sp,
                            color = Color.White.copy(alpha = 0.9f),
                            lineHeight = 17.sp
                        )
                    }
                }
            }
        }

        // 2. LLC Photo Showcase Frame
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "LLC Photo & Campus Facility",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = "Official educational facility & campus photograph",
                                fontSize = 11.sp,
                                color = Slate500
                            )
                        }

                        Button(
                            onClick = {
                                tempUrlInput = photoUrl
                                tempCaptionInput = photoCaption
                                showPhotoDialog = true
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                            shape = RoundedCornerShape(10.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            modifier = Modifier.height(34.dp)
                        ) {
                            Icon(Icons.Default.CameraAlt, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Change Photo", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Photo Container
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(Slate900)
                    ) {
                        AsyncImage(
                            model = photoUrl,
                            contentDescription = "Dunyoi Khirad LLC Photo",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )

                        // Verified Badge Overlay
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color.Black.copy(alpha = 0.65f),
                            modifier = Modifier
                                .align(Alignment.TopStart)
                                .padding(10.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("🏢", fontSize = 11.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Official Facility • Dunyoi Khirad LLC",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Caption
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = photoCaption,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = Slate600,
                            modifier = Modifier.weight(1f)
                        )
                        Text(
                            text = "✓ Verified Record",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = EmeraldSuccess
                        )
                    }
                }
            }
        }

        // 3. Key Metrics Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                MetricCard(title = "98.4%", subtitle = "Pass Rate", color = IndigoPrimary, modifier = Modifier.weight(1f))
                MetricCard(title = "1,200+", subtitle = "Alumni", color = VioletAccent, modifier = Modifier.weight(1f))
                MetricCard(title = "15+", subtitle = "Teachers", color = EmeraldSuccess, modifier = Modifier.weight(1f))
                MetricCard(title = "13", subtitle = "Lessons Cycle", color = AmberWarning, modifier = Modifier.weight(1f))
            }
        }

        // 4. Mission & Vision
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Text(
                        text = "Institutional Philosophy",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = IndigoLight,
                        border = BorderStroke(1.dp, IndigoPrimary.copy(alpha = 0.2f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("🎯 Our Mission", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = IndigoPrimary)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "To cultivate analytical minds, fluent global communicators, and morally upright leaders through disciplined pedagogical systems, world-class curricula, and individual academic mentorship.",
                                fontSize = 11.sp,
                                color = Slate700,
                                lineHeight = 16.sp
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = IndigoLight,
                        border = BorderStroke(1.dp, VioletAccent.copy(alpha = 0.2f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text("🔭 Our Vision", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = VioletAccent)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                "To stand as the benchmark educational institution in Central Asia, recognized for transformative learning outcomes, exceptional university admissions, and community educational advancement.",
                                fontSize = 11.sp,
                                color = Slate700,
                                lineHeight = 16.sp
                            )
                        }
                    }
                }
            }
        }

        // 5. Academic Departments & Programs
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Core Academic Programs",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    ProgramItem(
                        icon = "🗣️",
                        title = "Foreign Languages Department",
                        desc = "General & Academic English (Beginner to Upper-Intermediate), Spoken English & Phonetics Lab."
                    )
                    ProgramItem(
                        icon = "🏆",
                        title = "Standardized Exam Preparation",
                        desc = "Intensive IELTS Academic, TOEFL iBT, and university admission entrance examination training."
                    )
                    ProgramItem(
                        icon = "📝",
                        title = "13-Lesson Continuous Evaluation",
                        desc = "Proprietary structured evaluation of every lesson, unit test, and final examination."
                    )
                    ProgramItem(
                        icon = "📚",
                        title = "Digital Library & Audio Lab",
                        desc = "Curated textbooks, past papers, and native listening dialogue tracks."
                    )
                }
            }
        }

        // 6. Certified Faculty
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Senior Faculty & Administration",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    FacultyItem(initials = "DK", name = "Academic Council & Director", role = "Administration of Dunyoi Khirad LLC")
                    FacultyItem(initials = "FB", name = "Teacher F. Boymurodov", role = "Senior Lecturer & Exam Division Head")
                    FacultyItem(initials = "SJ", name = "Sarah Jenkins", role = "Upper-Intermediate & IELTS Specialist")
                }
            }
        }

        // 7. Legal Credentials & Contact
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Legal Accreditation & Campus Location",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    InfoRow(label = "Legal Form", value = "Limited Liability Company (ҶДММ)")
                    InfoRow(label = "Registered Entity", value = "ҶДММ \"Дунёи Хирад\"")
                    InfoRow(label = "State License", value = "№ ED-2023-TJ-94812 (Est. 2020)")
                    InfoRow(label = "Tax Identification (TIN)", value = "030048192-TJ")
                    InfoRow(label = "Campus Address", value = "14 Rudaki Avenue, 3rd Floor, Dunyoi Khirad Center")
                    InfoRow(label = "Telephone Hotline", value = "+992 (44) 600-13-13 / +992 (90) 131-30-00")
                    InfoRow(label = "Official Email", value = "info@dnyoikhirad.tj")
                    InfoRow(label = "Working Hours", value = "Mon - Sat: 08:00 AM - 08:00 PM (Sun: Seminars)")
                }
            }
        }
    }

    // Photo Edit / Preset Dialog
    if (showPhotoDialog) {
        AlertDialog(
            onDismissRequest = { showPhotoDialog = false },
            title = {
                Text("Put / Update LLC Photo", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Enter image URL or select from official facility photos:", fontSize = 12.sp, color = Slate600)

                    OutlinedTextField(
                        value = tempUrlInput,
                        onValueChange = { tempUrlInput = it },
                        label = { Text("Photo Web URL", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = tempCaptionInput,
                        onValueChange = { tempCaptionInput = it },
                        label = { Text("Photo Caption", fontSize = 11.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Text("Quick Presets:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate700)
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        FilterChip(
                            selected = false,
                            onClick = {
                                tempUrlInput = "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80"
                                tempCaptionInput = "Main Educational Campus & Administrative Headquarters of Dunyoi Khirad LLC"
                            },
                            label = { Text("Main Campus", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = false,
                            onClick = {
                                tempUrlInput = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80"
                                tempCaptionInput = "Academic Lecture Hall & Conference Room of Dunyoi Khirad LLC"
                            },
                            label = { Text("Hall", fontSize = 10.sp) }
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (tempUrlInput.isNotBlank()) {
                            photoUrl = tempUrlInput
                        }
                        if (tempCaptionInput.isNotBlank()) {
                            photoCaption = tempCaptionInput
                        }
                        showPhotoDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary)
                ) {
                    Text("Save Photo")
                }
            },
            dismissButton = {
                TextButton(onClick = { showPhotoDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
private fun MetricCard(title: String, subtitle: String, color: Color, modifier: Modifier = Modifier) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, Slate200),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 6.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = title, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = color)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = subtitle, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = Slate600)
        }
    }
}

@Composable
private fun ProgramItem(icon: String, title: String, desc: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Slate50)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(icon, fontSize = 20.sp)
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(text = title, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Text(text = desc, fontSize = 10.sp, color = Slate500, lineHeight = 14.sp)
        }
    }
}

@Composable
private fun FacultyItem(initials: String, name: String, role: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Slate50)
            .padding(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(34.dp)
                .clip(CircleShape)
                .background(IndigoPrimary),
            contentAlignment = Alignment.Center
        ) {
            Text(text = initials, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(text = name, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Text(text = role, fontSize = 10.sp, color = Slate500)
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp)
    ) {
        Text(text = label, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = Slate400)
        Text(text = value, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate800)
    }
}
