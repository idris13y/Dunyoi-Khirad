package com.example.model

import java.util.Locale
import java.util.UUID

data class Student(
    val id: String = UUID.randomUUID().toString(),
    val name: String = "",
    val lessons: List<String> = List(13) { "" },
    val tests: List<String> = List(5) { "" }
) {
    fun calculateLessonAverage(): String {
        val validScores = lessons.mapNotNull { it.trim().toDoubleOrNull() }
        return if (validScores.isNotEmpty()) {
            val avg = validScores.average()
            String.format(Locale.US, "%.1f", avg)
        } else {
            "-"
        }
    }

    fun calculateTestAverage(): String {
        val validScores = tests.mapNotNull { it.trim().toDoubleOrNull() }
        return if (validScores.isNotEmpty()) {
            val avg = validScores.average()
            String.format(Locale.US, "%.1f%%", avg)
        } else {
            "-"
        }
    }
}

data class GroupData(
    val name: String,
    val password: String,
    val teacher: String,
    val students: List<Student> = emptyList()
)

data class NewsItem(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val date: String,
    val imageUrl: String,
    val content: String
)

data class UserSession(
    val username: String,
    val role: String, // "admin" or "group"
    val displayName: String
) {
    val isAdmin: Boolean get() = role == "admin"
}
