"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import styles from "./search-location.module.css"

interface SearchLocationProps {
  onSearch: (location: string) => void
}

export default function SearchLocation({ onSearch }: SearchLocationProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for a city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          <Search size={20} />
        </button>
      </div>
    </form>
  )
}
