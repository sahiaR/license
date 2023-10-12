package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LicenseAbonnement.
 */
@Entity
@Table(name = "license_abonnement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LicenseAbonnement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "societe")
    private String societe;

    @Column(name = "nombre_d_utilisateur")
    private Integer nombreDUtilisateur;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LicenseAbonnement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public LicenseAbonnement startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public LicenseAbonnement endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getSociete() {
        return this.societe;
    }

    public LicenseAbonnement societe(String societe) {
        this.setSociete(societe);
        return this;
    }

    public void setSociete(String societe) {
        this.societe = societe;
    }

    public Integer getNombreDUtilisateur() {
        return this.nombreDUtilisateur;
    }

    public LicenseAbonnement nombreDUtilisateur(Integer nombreDUtilisateur) {
        this.setNombreDUtilisateur(nombreDUtilisateur);
        return this;
    }

    public void setNombreDUtilisateur(Integer nombreDUtilisateur) {
        this.nombreDUtilisateur = nombreDUtilisateur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LicenseAbonnement)) {
            return false;
        }
        return id != null && id.equals(((LicenseAbonnement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LicenseAbonnement{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", societe='" + getSociete() + "'" +
            ", nombreDUtilisateur=" + getNombreDUtilisateur() +
            "}";
    }
}
