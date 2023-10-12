import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LicenseAbonnementDetailComponent } from './license-abonnement-detail.component';

describe('LicenseAbonnement Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenseAbonnementDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: LicenseAbonnementDetailComponent,
              resolve: { licenseAbonnement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LicenseAbonnementDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load licenseAbonnement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LicenseAbonnementDetailComponent);

      // THEN
      expect(instance.licenseAbonnement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
