package com.example.data.db

import androidx.room.TypeConverter
import org.json.JSONArray

class Converters {
    @TypeConverter
    fun fromStringList(value: List<String>?): String {
        val arr = JSONArray()
        value?.forEach { arr.put(it) }
        return arr.toString()
    }

    @TypeConverter
    fun toStringList(value: String?): List<String> {
        if (value.isNullOrBlank()) return emptyList()
        val list = mutableListOf<String>()
        try {
            val arr = JSONArray(value)
            for (i in 0 until arr.length()) {
                list.add(arr.optString(i, ""))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return list
    }
}
