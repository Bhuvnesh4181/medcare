"use client";

import { ChangeEvent, useState, useEffect } from "react";
import CardComp from "../Card/Card";
import Search from "../SearchBar/Search";
import styles from "./CardsGrid.module.css";

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

            // Build query params based on selected filters
            const queryParams = new URLSearchParams();

            // Only add rating filter if not "any"
            if (filters.rating !== "any") {
                queryParams.append("rating", filters.rating);
            }

            // Get the integer value for experience
            if (filters.experience !== "any") {
                const expValue = experienceToIntMap[filters.experience];
                queryParams.append("experience", expValue.toString());
            }

            // Only add gender filter if not "any"
            if (filters.gender !== "any") {
                queryParams.append("gender", filters.gender);
            }

            // Only make the API call if there are query parameters
            if (queryParams.toString()) {
                setFiltersApplied(true);
                const response = await fetch(
                    `http://localhost:3001/api/doctors/filter?${queryParams.toString()}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pageNum: currentPage }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message ||
                            `HTTP error! status: ${response.status}`
                    );
                }

                const data: DoctorsResponse = await response.json();

                if (!data.ok) {
                    throw new Error(
                        data.message || "Failed to fetch filtered doctors"
                    );
                }

                if (!data.data?.rows) {
                    throw new Error("Invalid data format received from server");
                }

                setDoctors(data.data.rows);
                setTotalDoctors(data.data.total || 0);
            } else {
                // If no filters are applied, fetch all doctors
                await fetchDoctors();
            }

            // Don't reset to first page when filters are already applied and user is navigating pages
        } catch (err) {
            console.error("Error fetching filtered doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while filtering doctors"
            );
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

            // Ensure currentPage is a valid number
            const pageNum = Math.max(1, currentPage);

            const response = await fetch("http://localhost:3001/api/doctors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pageNum }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DoctorsResponse = await response.json();

            if (!data.ok) {
                throw new Error(data.message || "Failed to fetch doctors");
            }

            if (!data.data?.rows) {
                throw new Error("Invalid data format received from server");
            }

            setDoctors(data.data.rows);
            setTotalDoctors(data.data.total || 0);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching doctors"
            );
            setDoctors([]);
            setTotalDoctors(0);
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = async () => {
        if (!filtersApplied) return;

        setIsResetting(true);
        setFilters({
            rating: "any",
            experience: "any",
            gender: "any",
        });
        setCurrentPage(1);
        setFiltersApplied(false);
        setSearchApplied(false);
        setSearchQuery("");

        // Fetch all doctors after resetting filters
        try {
            setLoading(true);
            setError(null);
            await fetchDoctors();
        } catch (err) {
            console.error("Error fetching doctors after reset:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching doctors"
            );
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
        setCurrentPage(1);
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

            const queryParams = new URLSearchParams();
            queryParams.append("q", searchVal);
            queryParams.append("page", currentPage.toString());

            // Clear any active filters when searching
            setFiltersApplied(false);
            setSearchApplied(true);

            const response = await fetch(
                `http://localhost:3001/api/doctors/search?${queryParams.toString()}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: DoctorsResponse = await response.json();

            if (!data.ok) {
                throw new Error(data.message || "Failed to search doctors");
            }

            if (!data.data?.rows) {
                throw new Error("Invalid data format received from server");
            }

            setDoctors(data.data.rows);
            setTotalDoctors(data.data.total || 0);
            setCurrentPage(1); // Reset to first page for new search results
        } catch (err) {
            console.error("Error searching doctors:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while searching doctors"
            );
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
                    {totalDoctors} doctors available
                </p>
                <p className={styles.subText}>
                    Book appointments with minimum wait-time & verified doctor
                    details
                </p>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.filtersContainer}>
                    <div className={styles.filterHeader}>
                        <p>Filter By:</p>
                        <button
                            onClick={resetFilters}
                            className={styles.resetButton}
                        >
                            Reset
                        </button>
                    </div>

                    <div className={styles.filterSection}>
                        <h4 className={styles.filterTitle}>Rating</h4>
                        <div className={styles.filterOptions}>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="any"
                                    checked={filters.rating === "any"}
                                    onChange={handleFilterChange}
                                />
                                <span>Show All</span>
                            </label>

                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="1"
                                    checked={filters.rating === "1"}
                                    onChange={handleFilterChange}
                                />
                                <span>1 star</span>
                            </label>

                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="2"
                                    checked={filters.rating === "2"}
                                    onChange={handleFilterChange}
                                />
                                <span>2 star</span>
                            </label>

                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="3"
                                    checked={filters.rating === "3"}
                                    onChange={handleFilterChange}
                                />
                                <span>3 star</span>
                            </label>

                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="4"
                                    checked={filters.rating === "4"}
                                    onChange={handleFilterChange}
                                />
                                <span>4 star</span>
                            </label>

                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value="5"
                                    checked={filters.rating === "5"}
                                    onChange={handleFilterChange}
                                />
                                <span>5 star</span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <h4 className={styles.filterTitle}>Experience</h4>
                        <div className={styles.filterOptions}>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="any"
                                    checked={filters.experience === "any"}
                                    onChange={handleFilterChange}
                                />
                                <span>Any</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="15+"
                                    checked={filters.experience === "15+"}
                                    onChange={handleFilterChange}
                                />
                                <span>15+ years</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="10-15"
                                    checked={filters.experience === "10-15"}
                                    onChange={handleFilterChange}
                                />
                                <span>10-15 years</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="5-10"
                                    checked={filters.experience === "5-10"}
                                    onChange={handleFilterChange}
                                />
                                <span>5-10 years</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="3-5"
                                    checked={filters.experience === "3-5"}
                                    onChange={handleFilterChange}
                                />
                                <span>3-5 years</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="1-3"
                                    checked={filters.experience === "1-3"}
                                    onChange={handleFilterChange}
                                />
                                <span>1-3 years</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="experience"
                                    value="0-1"
                                    checked={filters.experience === "0-1"}
                                    onChange={handleFilterChange}
                                />
                                <span>0-1 years</span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <h4 className={styles.filterTitle}>Gender</h4>
                        <div className={styles.filterOptions}>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="any"
                                    checked={filters.gender === "any"}
                                    onChange={handleFilterChange}
                                />
                                <span>Show all</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={filters.gender === "male"}
                                    onChange={handleFilterChange}
                                />
                                <span>Male</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={filters.gender === "female"}
                                    onChange={handleFilterChange}
                                />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>
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
                    {/* Cards Grid */}
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
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`${styles.paginationButton} ${
                                        currentPage === pageNum
                                            ? styles.activePage
                                            : ""
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}