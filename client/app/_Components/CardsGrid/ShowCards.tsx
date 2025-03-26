"use client";

import { ChangeEvent, useState, useEffect } from "react";
import CardComp from "../Card/Card";
import Search from "../SearchBar/Search";
import styles from "./CardsGrid.module.css";

interface Doctor {
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
        experience: "15+",
        gender: "any",
    });

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchDoctors();
    }, [currentPage]);

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

    const resetFilters = () => {
        setFilters({
            rating: "any",
            experience: "15+",
            gender: "any",
        });
        setCurrentPage(1);
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
            <Search />
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
                    <button className={styles.applyBtn}>Apply Filters</button>
                </div>

                <div className={styles.gridContainer}>
                    {/* Cards Grid */}
                    <div className={styles.cardsGrid}>
                        {doctors.map((doctor) => (
                            <CardComp
                                key={doctor.id}
                                doctor={{
                                    ...doctor,
                                    image: doctor.profile_pic,
                                    degree: doctor.specialty,
                                }}
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