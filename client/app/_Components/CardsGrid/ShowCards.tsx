"use client";

import { ChangeEvent, useState, useEffect } from "react";
import CardComp from "../Card/Card";
import Search from "../SearchBar/Search";
import styles from "./CardsGrid.module.css";
import { useRouter } from "next/navigation";

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    experience: string;
    rating: number;
    profile_pic: string;
}

interface DoctorsResponse {
    ok: boolean;
    data: {
        rows: Doctor[];
        total: number;
    };
    message?: string;
}

export default function ShowCards() {
    const [filters, setFilters] = useState({
        rating: "any",
        experience: "any",
        gender: "any",
    });

    // Map experience string values to integer values for the backend
    const experienceToIntMap: Record<string, number> = {
        "15+": 15,
        "10-15": 10,
        "5-10": 5,
        "3-5": 3,
        "1-3": 1,
        "0-1": 0,
    };

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isResetting, setIsResetting] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [searchApplied, setSearchApplied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 6;

    const router = useRouter();

    useEffect(() => {
        if (!isResetting) {
            if (searchApplied) {
                handleSearch(searchQuery);
            } else if (filtersApplied) {
                handleFilters();
            } else {
                fetchDoctors();
            }
        }
    }, [currentPage, isResetting, filtersApplied, searchApplied, searchQuery]);

    const handleFilters = async () => {
        try {
            setLoading(true);
            setError(null);
    
            const queryParams = new URLSearchParams();
    
            // Helper function to append filter values if not "any"
            const appendFilter = (key: string, value: string | number) => {
                if (value !== "any") queryParams.append(key, value.toString());
            };
    
            appendFilter("rating", filters.rating);
            appendFilter("experience", experienceToIntMap[filters.experience] || "any");
            appendFilter("gender", filters.gender);
    
            if (queryParams.toString()) {
                setFiltersApplied(true);
                const response = await fetch(
                    `http://localhost:3001/api/doctors/filter?${queryParams.toString()}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pageNum: currentPage }),
                    }
                );
    
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }
    
                const data: DoctorsResponse = await response.json();
                
                if (!data.ok || !data.data?.rows) {
                    throw new Error(data.message || "Invalid data format received from server");
                }
    
                setDoctors(data.data.rows);
                setTotalDoctors(data.data.total || 0);
            } else {
                await fetchDoctors();
            }
        } catch (err) {
            console.error("Error fetching filtered doctors:", err);
            setError(err instanceof Error ? err.message : "An error occurred while filtering doctors");
            setDoctors([]);
            setTotalDoctors(0);
        } finally {
            setLoading(false);
        }
    };
    

const fetchDoctors = async () => {
    try {
        setLoading(true);
        setError(null);

        const pageNum = Math.max(1, currentPage); // Ensure valid page number

        const response = await fetch("http://localhost:3001/api/doctors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pageNum }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
        }

        const data: DoctorsResponse = await response.json();

        if (!data.ok || !data.data?.rows) {
            throw new Error(data.message || "Invalid data format received from server");
        }

        setDoctors(data.data.rows);
        setTotalDoctors(data.data.total || 0);
    } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching doctors");
        setDoctors([]);
        setTotalDoctors(0);
    } finally {
        setLoading(false);
    }
};

const resetFilters = async () => {
    if (!filtersApplied) return;

    setIsResetting(true);
    setFilters({ rating: "any", experience: "any", gender: "any" });
    setFiltersApplied(false);
    setSearchApplied(false);
    setSearchQuery("");

    try {
        setLoading(true);
        setError(null);
        await fetchDoctors();
    } catch (err) {
        console.error("Error fetching doctors after reset:", err);
        setError(err instanceof Error ? err.message : "An error occurred while fetching doctors");
    } finally {
        setLoading(false);
        setIsResetting(false);
    }
};


    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
        // setCurrentPage(1);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = async (searchVal: string) => {
        if (!searchVal) return;
    
        try {
            setLoading(true);
            setError(null);
            setSearchQuery(searchVal);
            setFiltersApplied(false);
            setSearchApplied(true);
    
            const queryParams = new URLSearchParams({
                q: searchVal,
                page: currentPage.toString(),
            });
    
            const response = await fetch(
                `http://localhost:3001/api/doctors/search?${queryParams.toString()}`
            );
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
            }
    
            const data: DoctorsResponse = await response.json();
    
            if (!data.ok || !data.data?.rows) {
                throw new Error(data.message || "Invalid data format received from server");
            }
    
            setDoctors(data.data.rows);
            setTotalDoctors(data.data.total || 0);
            setCurrentPage(1); // Reset to first page for new search results
        } catch (err) {
            console.error("Error searching doctors:", err);
            setError(err instanceof Error ? err.message : "An error occurred while searching doctors");
            setDoctors([]);
            setTotalDoctors(0);
        } finally {
            setLoading(false);
        }
    };
    

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading doctors...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error}</p>
                <button onClick={fetchDoctors} className={styles.retryButton}>
                    Retry
                </button>
            </div>
        );
    }

    const totalPages = Math.max(1, Math.ceil(totalDoctors / itemsPerPage));
    return (
        <div className={styles.pageContainer}>
            <Search handleSearch={handleSearch} />
            <div className={styles.infoText}>
                <p className={styles.docCount}>
                    {totalDoctors} {totalDoctors === 1 ? "doctor available" : "doctors available"}
                </p>
                <p className={styles.subText}>
                    Book appointments with minimum wait-time & verified doctor details
                </p>
            </div>
    
            <div className={styles.mainContent}>
                <div className={styles.filtersContainer}>
                    <div className={styles.filterHeader}>
                        <p>Filter By:</p>
                        <button onClick={resetFilters} className={styles.resetButton}>Reset</button>
                    </div>
    
                    {[
                        { title: "Rating", name: "rating", options: ["any", "1", "2", "3", "4", "5"] },
                        { title: "Experience", name: "experience", options: ["any", "15+", "10-15", "5-10", "3-5", "1-3", "0-1"] },
                        { title: "Gender", name: "gender", options: ["any", "male", "female"] }
                    ].map(({ title, name, options }) => (
                        <div key={name} className={styles.filterSection}>
                            <h4 className={styles.filterTitle}>{title}</h4>
                            <div className={styles.filterOptions}>
                                {options.map((option) => (
                                    <label key={option} className={styles.filterOption}>
                                        <input
                                            type="radio"
                                            name={name}
                                            value={option}
                                            checked={filters[name as keyof typeof filters] === option}
                                            onChange={handleFilterChange}
                                        />
                                        <span>{option === "any" ? "Show All" : option + (name === "rating" ? " star" : "")}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
    
                    <button
                        onClick={() => {
                            if (!filtersApplied) {
                                setCurrentPage(1);
                            }
                            handleFilters();
                        }}
                        className={styles.applyBtn}
                    >
                        Apply Filters
                    </button>
                </div>
    
                <div className={styles.gridContainer}>
                    <div className={styles.cardsGrid}>
                        {doctors.map((doctor) => (
                            <CardComp
                                key={doctor.id}
                                experience={doctor.experience}
                                id={doctor.id}
                                name={doctor.name}
                                profile_pic={doctor.profile_pic}
                                rating={doctor.rating}
                                specialty={doctor.specialty}
                                handleCardClick={() => router.push(`/appointments/doctor/${doctor.id}`)}
                            />
                        ))}
                    </div>
    
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.paginationButton}>
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`${styles.paginationButton} ${currentPage === pageNum ? styles.activePage : ""}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.paginationButton}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}    