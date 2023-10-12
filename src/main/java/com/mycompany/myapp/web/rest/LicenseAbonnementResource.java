package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.LicenseAbonnement;
import com.mycompany.myapp.repository.LicenseAbonnementRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.LicenseAbonnement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LicenseAbonnementResource {

    private final Logger log = LoggerFactory.getLogger(LicenseAbonnementResource.class);

    private static final String ENTITY_NAME = "licenseAbonnement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LicenseAbonnementRepository licenseAbonnementRepository;

    public LicenseAbonnementResource(LicenseAbonnementRepository licenseAbonnementRepository) {
        this.licenseAbonnementRepository = licenseAbonnementRepository;
    }

    /**
     * {@code POST  /license-abonnements} : Create a new licenseAbonnement.
     *
     * @param licenseAbonnement the licenseAbonnement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new licenseAbonnement, or with status {@code 400 (Bad Request)} if the licenseAbonnement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/license-abonnements")
    public ResponseEntity<LicenseAbonnement> createLicenseAbonnement(@RequestBody LicenseAbonnement licenseAbonnement)
        throws URISyntaxException {
        log.debug("REST request to save LicenseAbonnement : {}", licenseAbonnement);
        if (licenseAbonnement.getId() != null) {
            throw new BadRequestAlertException("A new licenseAbonnement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LicenseAbonnement result = licenseAbonnementRepository.save(licenseAbonnement);
        return ResponseEntity
            .created(new URI("/api/license-abonnements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /license-abonnements/:id} : Updates an existing licenseAbonnement.
     *
     * @param id the id of the licenseAbonnement to save.
     * @param licenseAbonnement the licenseAbonnement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated licenseAbonnement,
     * or with status {@code 400 (Bad Request)} if the licenseAbonnement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the licenseAbonnement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/license-abonnements/{id}")
    public ResponseEntity<LicenseAbonnement> updateLicenseAbonnement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LicenseAbonnement licenseAbonnement
    ) throws URISyntaxException {
        log.debug("REST request to update LicenseAbonnement : {}, {}", id, licenseAbonnement);
        if (licenseAbonnement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, licenseAbonnement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!licenseAbonnementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LicenseAbonnement result = licenseAbonnementRepository.save(licenseAbonnement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, licenseAbonnement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /license-abonnements/:id} : Partial updates given fields of an existing licenseAbonnement, field will ignore if it is null
     *
     * @param id the id of the licenseAbonnement to save.
     * @param licenseAbonnement the licenseAbonnement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated licenseAbonnement,
     * or with status {@code 400 (Bad Request)} if the licenseAbonnement is not valid,
     * or with status {@code 404 (Not Found)} if the licenseAbonnement is not found,
     * or with status {@code 500 (Internal Server Error)} if the licenseAbonnement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/license-abonnements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LicenseAbonnement> partialUpdateLicenseAbonnement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LicenseAbonnement licenseAbonnement
    ) throws URISyntaxException {
        log.debug("REST request to partial update LicenseAbonnement partially : {}, {}", id, licenseAbonnement);
        if (licenseAbonnement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, licenseAbonnement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!licenseAbonnementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LicenseAbonnement> result = licenseAbonnementRepository
            .findById(licenseAbonnement.getId())
            .map(existingLicenseAbonnement -> {
                if (licenseAbonnement.getStartDate() != null) {
                    existingLicenseAbonnement.setStartDate(licenseAbonnement.getStartDate());
                }
                if (licenseAbonnement.getEndDate() != null) {
                    existingLicenseAbonnement.setEndDate(licenseAbonnement.getEndDate());
                }
                if (licenseAbonnement.getSociete() != null) {
                    existingLicenseAbonnement.setSociete(licenseAbonnement.getSociete());
                }
                if (licenseAbonnement.getNombreDUtilisateur() != null) {
                    existingLicenseAbonnement.setNombreDUtilisateur(licenseAbonnement.getNombreDUtilisateur());
                }

                return existingLicenseAbonnement;
            })
            .map(licenseAbonnementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, licenseAbonnement.getId().toString())
        );
    }

    /**
     * {@code GET  /license-abonnements} : get all the licenseAbonnements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of licenseAbonnements in body.
     */
    @GetMapping("/license-abonnements")
    public List<LicenseAbonnement> getAllLicenseAbonnements() {
        log.debug("REST request to get all LicenseAbonnements");
        return licenseAbonnementRepository.findAll();
    }

    /**
     * {@code GET  /license-abonnements/:id} : get the "id" licenseAbonnement.
     *
     * @param id the id of the licenseAbonnement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the licenseAbonnement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/license-abonnements/{id}")
    public ResponseEntity<LicenseAbonnement> getLicenseAbonnement(@PathVariable Long id) {
        log.debug("REST request to get LicenseAbonnement : {}", id);
        Optional<LicenseAbonnement> licenseAbonnement = licenseAbonnementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(licenseAbonnement);
    }

    /**
     * {@code DELETE  /license-abonnements/:id} : delete the "id" licenseAbonnement.
     *
     * @param id the id of the licenseAbonnement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/license-abonnements/{id}")
    public ResponseEntity<Void> deleteLicenseAbonnement(@PathVariable Long id) {
        log.debug("REST request to delete LicenseAbonnement : {}", id);
        licenseAbonnementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
