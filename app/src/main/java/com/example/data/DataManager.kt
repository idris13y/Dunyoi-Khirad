package com.example.data

import android.content.Context
import android.content.SharedPreferences
import com.example.data.db.AppDatabase
import com.example.data.db.GroupEntity
import com.example.data.db.NewsEntity
import com.example.data.db.StudentEntity
import com.example.model.GroupData
import com.example.model.NewsItem
import com.example.model.Student
import com.example.model.UserSession
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.util.UUID

class DataManager(context: Context) {
    private val db = AppDatabase.getDatabase(context)
    private val studentDao = db.studentDao()
    private val groupDao = db.groupDao()
    private val newsDao = db.newsDao()
    private val prefs: SharedPreferences = context.getSharedPreferences("apex_edu_portal", Context.MODE_PRIVATE)

    companion object {
        const val KEY_SESSION = "apex_edu_session"
        const val ADMIN_USER = "admin"
        const val ADMIN_PASS = "@idrisyorov1313@"
    }

    init {
        runBlocking(Dispatchers.IO) {
            initializeRoomSeedData()
        }
    }

    private suspend fun initializeRoomSeedData() {
        val existingGroups = groupDao.getAllGroups()
        if (existingGroups.isEmpty()) {
            val upperGroup = GroupEntity(
                name = "Upper-intermediate",
                password = "upper123",
                teacher = "Sarah Jenkins"
            )
            groupDao.insertGroup(upperGroup)

            val initialStudents = listOf(
                StudentEntity(
                    id = "student_1",
                    groupName = "Upper-intermediate",
                    name = "Alexander Miller",
                    orderIndex = 0,
                    lessons = listOf("92", "88", "95", "90", "85", "94", "91", "89", "96", "90", "92", "94", "98"),
                    tests = listOf("90", "92", "94", "91", "95")
                ),
                StudentEntity(
                    id = "student_2",
                    groupName = "Upper-intermediate",
                    name = "Sophia Rakhimova",
                    orderIndex = 1,
                    lessons = listOf("85", "87", "88", "92", "90", "89", "93", "85", "90", "88", "86", "92", "94"),
                    tests = listOf("88", "86", "90", "89", "92")
                ),
                StudentEntity(
                    id = "student_3",
                    groupName = "Upper-intermediate",
                    name = "Daniel Kim",
                    orderIndex = 2,
                    lessons = listOf("78", "82", "80", "85", "84", "88", "82", "80", "85", "87", "89", "90", "91"),
                    tests = listOf("80", "84", "85", "88", "89")
                )
            )
            studentDao.insertStudents(initialStudents)
        }

        val existingNews = newsDao.getAllNews()
        if (existingNews.isEmpty()) {
            val initialNews = listOf(
                NewsEntity(
                    id = "news_1",
                    title = "Autumn Speaking Competition Winners!",
                    date = "October 16, 2026",
                    imageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
                    content = "Congratulations to our students who took top spots in the Regional English Debate Forum. Certificates and prizes were awarded today in the main hall."
                ),
                NewsEntity(
                    id = "news_2",
                    title = "Mid-Term Examination Schedule Released",
                    date = "October 10, 2026",
                    imageUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
                    content = "All groups are requested to review their upcoming test timelines. Preparation sessions will be held on Saturdays."
                )
            )
            initialNews.forEach { newsDao.insertNews(it) }
        }
    }

    // --- Synchronous and Coroutine Access to Room Database ---

    fun loadGroups(): Map<String, GroupData> = runBlocking(Dispatchers.IO) {
        val groupEntities = groupDao.getAllGroups()
        val allStudents = studentDao.getAllStudents()
        val studentsByGroup = allStudents.groupBy { it.groupName }

        val result = mutableMapOf<String, GroupData>()
        for (g in groupEntities) {
            val sEntities = studentsByGroup[g.name] ?: emptyList()
            val domainStudents = sEntities.map { s ->
                Student(
                    id = s.id,
                    name = s.name,
                    lessons = s.lessons,
                    tests = s.tests
                )
            }
            result[g.name] = GroupData(
                name = g.name,
                password = g.password,
                teacher = g.teacher,
                students = domainStudents
            )
        }
        result
    }

    suspend fun saveStudentsForGroup(groupName: String, students: List<Student>) = withContext(Dispatchers.IO) {
        val entities = students.mapIndexed { idx, s ->
            StudentEntity(
                id = s.id,
                groupName = groupName,
                name = s.name,
                orderIndex = idx,
                lessons = s.lessons,
                tests = s.tests
            )
        }
        studentDao.replaceStudentsForGroup(groupName, entities)
    }

    suspend fun createGroup(groupName: String, password: String, teacher: String): Boolean = withContext(Dispatchers.IO) {
        val existing = groupDao.getGroupByName(groupName)
        if (existing != null) {
            false
        } else {
            groupDao.insertGroup(GroupEntity(name = groupName, password = password, teacher = teacher))
            studentDao.insertStudent(
                StudentEntity(
                    id = UUID.randomUUID().toString(),
                    groupName = groupName,
                    name = "Student 1",
                    orderIndex = 0,
                    lessons = List(13) { "" },
                    tests = List(5) { "" }
                )
            )
            true
        }
    }

    suspend fun deleteGroup(groupName: String) = withContext(Dispatchers.IO) {
        groupDao.deleteGroupByName(groupName)
    }

    // --- News Operations via Room DAO ---

    fun loadNews(): List<NewsItem> = runBlocking(Dispatchers.IO) {
        newsDao.getAllNews().map {
            NewsItem(
                id = it.id,
                title = it.title,
                date = it.date,
                imageUrl = it.imageUrl,
                content = it.content
            )
        }
    }

    suspend fun addNews(item: NewsItem) = withContext(Dispatchers.IO) {
        newsDao.insertNews(
            NewsEntity(
                id = item.id,
                title = item.title,
                date = item.date,
                imageUrl = item.imageUrl,
                content = item.content
            )
        )
    }

    suspend fun deleteNews(id: String) = withContext(Dispatchers.IO) {
        newsDao.deleteNewsById(id)
    }

    // --- Session Persistence ---

    fun loadSession(): UserSession? {
        val jsonStr = prefs.getString(KEY_SESSION, null) ?: return null
        return try {
            val obj = JSONObject(jsonStr)
            UserSession(
                username = obj.optString("username", ""),
                role = obj.optString("role", ""),
                displayName = obj.optString("displayName", "")
            )
        } catch (e: Exception) {
            null
        }
    }

    fun saveSession(session: UserSession?) {
        if (session == null) {
            prefs.edit().remove(KEY_SESSION).apply()
        } else {
            val obj = JSONObject()
            obj.put("username", session.username)
            obj.put("role", session.role)
            obj.put("displayName", session.displayName)
            prefs.edit().putString(KEY_SESSION, obj.toString()).apply()
        }
    }
}
