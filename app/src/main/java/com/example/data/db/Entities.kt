package com.example.data.db

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "groups")
data class GroupEntity(
    @PrimaryKey
    val name: String,
    val password: String,
    val teacher: String
)

@Entity(
    tableName = "students",
    foreignKeys = [
        ForeignKey(
            entity = GroupEntity::class,
            parentColumns = ["name"],
            childColumns = ["groupName"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index(value = ["groupName"])]
)
data class StudentEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val groupName: String,
    val name: String,
    val orderIndex: Int = 0,
    val lessons: List<String> = List(13) { "" },
    val tests: List<String> = List(5) { "" }
)

@Entity(tableName = "news")
data class NewsEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val date: String,
    val imageUrl: String,
    val content: String,
    val createdAt: Long = System.currentTimeMillis()
)
