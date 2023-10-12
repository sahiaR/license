import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LicenseAbonnementService } from '../service/license-abonnement.service';

import { LicenseAbonnementComponent } from './license-abonnement.component';

describe('LicenseAbonnement Management Component', () => {
  let comp: LicenseAbonnementComponent;
  let fixture: ComponentFixture<LicenseAbonnementComponent>;
  let service: LicenseAbonnementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'license-abonnement', component: LicenseAbonnementComponent }]),
        HttpClientTestingModule,
        LicenseAbonnementComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LicenseAbonnementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LicenseAbonnementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LicenseAbonnementService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.licenseAbonnements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to licenseAbonnementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLicenseAbonnementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLicenseAbonnementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
