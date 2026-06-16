import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockGroupComponent } from './block-group.component';

describe('BlockGroupComponent', () => {
  let component: BlockGroupComponent;
  let fixture: ComponentFixture<BlockGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockGroupComponent]
    });
    fixture = TestBed.createComponent(BlockGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
