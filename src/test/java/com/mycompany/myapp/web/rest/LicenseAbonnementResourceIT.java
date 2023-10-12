package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.LicenseAbonnement;
import com.mycompany.myapp.repository.LicenseAbonnementRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LicenseAbonnementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LicenseAbonnementResourceIT {

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_SOCIETE = "AAAAAAAAAA";
    private static final String UPDATED_SOCIETE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NOMBRE_D_UTILISATEUR = 1;
    private static final Integer UPDATED_NOMBRE_D_UTILISATEUR = 2;

    private static final String ENTITY_API_URL = "/api/license-abonnements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LicenseAbonnementRepository licenseAbonnementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLicenseAbonnementMockMvc;

    private LicenseAbonnement licenseAbonnement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LicenseAbonnement createEntity(EntityManager em) {
        LicenseAbonnement licenseAbonnement = new LicenseAbonnement()
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .societe(DEFAULT_SOCIETE)
            .nombreDUtilisateur(DEFAULT_NOMBRE_D_UTILISATEUR);
        return licenseAbonnement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LicenseAbonnement createUpdatedEntity(EntityManager em) {
        LicenseAbonnement licenseAbonnement = new LicenseAbonnement()
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .societe(UPDATED_SOCIETE)
            .nombreDUtilisateur(UPDATED_NOMBRE_D_UTILISATEUR);
        return licenseAbonnement;
    }

    @BeforeEach
    public void initTest() {
        licenseAbonnement = createEntity(em);
    }

    @Test
    @Transactional
    void createLicenseAbonnement() throws Exception {
        int databaseSizeBeforeCreate = licenseAbonnementRepository.findAll().size();
        // Create the LicenseAbonnement
        restLicenseAbonnementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isCreated());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeCreate + 1);
        LicenseAbonnement testLicenseAbonnement = licenseAbonnementList.get(licenseAbonnementList.size() - 1);
        assertThat(testLicenseAbonnement.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLicenseAbonnement.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testLicenseAbonnement.getSociete()).isEqualTo(DEFAULT_SOCIETE);
        assertThat(testLicenseAbonnement.getNombreDUtilisateur()).isEqualTo(DEFAULT_NOMBRE_D_UTILISATEUR);
    }

    @Test
    @Transactional
    void createLicenseAbonnementWithExistingId() throws Exception {
        // Create the LicenseAbonnement with an existing ID
        licenseAbonnement.setId(1L);

        int databaseSizeBeforeCreate = licenseAbonnementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLicenseAbonnementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLicenseAbonnements() throws Exception {
        // Initialize the database
        licenseAbonnementRepository.saveAndFlush(licenseAbonnement);

        // Get all the licenseAbonnementList
        restLicenseAbonnementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(licenseAbonnement.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].societe").value(hasItem(DEFAULT_SOCIETE)))
            .andExpect(jsonPath("$.[*].nombreDUtilisateur").value(hasItem(DEFAULT_NOMBRE_D_UTILISATEUR)));
    }

    @Test
    @Transactional
    void getLicenseAbonnement() throws Exception {
        // Initialize the database
        licenseAbonnementRepository.saveAndFlush(licenseAbonnement);

        // Get the licenseAbonnement
        restLicenseAbonnementMockMvc
            .perform(get(ENTITY_API_URL_ID, licenseAbonnement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(licenseAbonnement.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.societe").value(DEFAULT_SOCIETE))
            .andExpect(jsonPath("$.nombreDUtilisateur").value(DEFAULT_NOMBRE_D_UTILISATEUR));
    }

    @Test
    @Transactional
    void getNonExistingLicenseAbonnement() throws Exception {
        // Get the licenseAbonnement
        restLicenseAbonnementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLicenseAbonnement() throws Exception {
        // Initialize the database
        licenseAbonnementRepository.saveAndFlush(licenseAbonnement);

        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();

        // Update the licenseAbonnement
        LicenseAbonnement updatedLicenseAbonnement = licenseAbonnementRepository.findById(licenseAbonnement.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLicenseAbonnement are not directly saved in db
        em.detach(updatedLicenseAbonnement);
        updatedLicenseAbonnement
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .societe(UPDATED_SOCIETE)
            .nombreDUtilisateur(UPDATED_NOMBRE_D_UTILISATEUR);

        restLicenseAbonnementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLicenseAbonnement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLicenseAbonnement))
            )
            .andExpect(status().isOk());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
        LicenseAbonnement testLicenseAbonnement = licenseAbonnementList.get(licenseAbonnementList.size() - 1);
        assertThat(testLicenseAbonnement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLicenseAbonnement.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLicenseAbonnement.getSociete()).isEqualTo(UPDATED_SOCIETE);
        assertThat(testLicenseAbonnement.getNombreDUtilisateur()).isEqualTo(UPDATED_NOMBRE_D_UTILISATEUR);
    }

    @Test
    @Transactional
    void putNonExistingLicenseAbonnement() throws Exception {
        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();
        licenseAbonnement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLicenseAbonnementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, licenseAbonnement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLicenseAbonnement() throws Exception {
        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();
        licenseAbonnement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenseAbonnementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLicenseAbonnement() throws Exception {
        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();
        licenseAbonnement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenseAbonnementMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLicenseAbonnementWithPatch() throws Exception {
        // Initialize the database
        licenseAbonnementRepository.saveAndFlush(licenseAbonnement);

        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();

        // Update the licenseAbonnement using partial update
        LicenseAbonnement partialUpdatedLicenseAbonnement = new LicenseAbonnement();
        partialUpdatedLicenseAbonnement.setId(licenseAbonnement.getId());

        partialUpdatedLicenseAbonnement.startDate(UPDATED_START_DATE);

        restLicenseAbonnementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLicenseAbonnement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLicenseAbonnement))
            )
            .andExpect(status().isOk());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
        LicenseAbonnement testLicenseAbonnement = licenseAbonnementList.get(licenseAbonnementList.size() - 1);
        assertThat(testLicenseAbonnement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLicenseAbonnement.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testLicenseAbonnement.getSociete()).isEqualTo(DEFAULT_SOCIETE);
        assertThat(testLicenseAbonnement.getNombreDUtilisateur()).isEqualTo(DEFAULT_NOMBRE_D_UTILISATEUR);
    }

    @Test
    @Transactional
    void fullUpdateLicenseAbonnementWithPatch() throws Exception {
        // Initialize the database
        licenseAbonnementRepository.saveAndFlush(licenseAbonnement);

        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();

        // Update the licenseAbonnement using partial update
        LicenseAbonnement partialUpdatedLicenseAbonnement = new LicenseAbonnement();
        partialUpdatedLicenseAbonnement.setId(licenseAbonnement.getId());

        partialUpdatedLicenseAbonnement
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .societe(UPDATED_SOCIETE)
            .nombreDUtilisateur(UPDATED_NOMBRE_D_UTILISATEUR);

        restLicenseAbonnementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLicenseAbonnement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLicenseAbonnement))
            )
            .andExpect(status().isOk());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
        LicenseAbonnement testLicenseAbonnement = licenseAbonnementList.get(licenseAbonnementList.size() - 1);
        assertThat(testLicenseAbonnement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLicenseAbonnement.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLicenseAbonnement.getSociete()).isEqualTo(UPDATED_SOCIETE);
        assertThat(testLicenseAbonnement.getNombreDUtilisateur()).isEqualTo(UPDATED_NOMBRE_D_UTILISATEUR);
    }

    @Test
    @Transactional
    void patchNonExistingLicenseAbonnement() throws Exception {
        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();
        licenseAbonnement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLicenseAbonnementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, licenseAbonnement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLicenseAbonnement() throws Exception {
        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();
        licenseAbonnement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenseAbonnementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLicenseAbonnement() throws Exception {
        int databaseSizeBeforeUpdate = licenseAbonnementRepository.findAll().size();
        licenseAbonnement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLicenseAbonnementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(licenseAbonnement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LicenseAbonnement in the database
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLicenseAbonnement() throws Exception {
        // Initialize the database
        licenseAbonnementRepository.saveAndFlush(licenseAbonnement);

        int databaseSizeBeforeDelete = licenseAbonnementRepository.findAll().size();

        // Delete the licenseAbonnement
        restLicenseAbonnementMockMvc
            .perform(delete(ENTITY_API_URL_ID, licenseAbonnement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LicenseAbonnement> licenseAbonnementList = licenseAbonnementRepository.findAll();
        assertThat(licenseAbonnementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
