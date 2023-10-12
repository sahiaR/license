package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.LicenseAbonnement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LicenseAbonnement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LicenseAbonnementRepository extends JpaRepository<LicenseAbonnement, Long> {}
