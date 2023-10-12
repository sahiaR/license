package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LicenseAbonnementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LicenseAbonnement.class);
        LicenseAbonnement licenseAbonnement1 = new LicenseAbonnement();
        licenseAbonnement1.setId(1L);
        LicenseAbonnement licenseAbonnement2 = new LicenseAbonnement();
        licenseAbonnement2.setId(licenseAbonnement1.getId());
        assertThat(licenseAbonnement1).isEqualTo(licenseAbonnement2);
        licenseAbonnement2.setId(2L);
        assertThat(licenseAbonnement1).isNotEqualTo(licenseAbonnement2);
        licenseAbonnement1.setId(null);
        assertThat(licenseAbonnement1).isNotEqualTo(licenseAbonnement2);
    }
}
