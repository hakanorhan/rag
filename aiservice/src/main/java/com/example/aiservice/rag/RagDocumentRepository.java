package com.example.aiservice.rag;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RagDocumentRepository extends JpaRepository<RagDocument, UUID> {

    // Select metadata only so listing documents does not transfer their PDF bytes.
    List<RagDocumentDTO> findAllProjectedByOrderByUpdatedAtDescIdAsc();

    Optional<RagDocument> findFirstBySha256OrderByCreatedAtAsc(String sha256);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from RagDocument d where d.id = :id")
    Optional<RagDocument> findByIdForUpdate(@Param("id") UUID id);
}
