import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { Category } from "@core/models/category.model";
import { categoriesData } from "@core/mocks/categories";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface BreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: BreadCrumb[] = [];

  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit() {
    this.updateBreadcrumbs();

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.updateBreadcrumbs());
  }

  private updateBreadcrumbs(): void {
    const urlSegments: string[] = this.router.url.split('/').filter(Boolean);

    this.breadcrumbs = this.createBreadcrumbs(urlSegments);
  }

  private createBreadcrumbs(segments: string[]): BreadCrumb[] {
    let url: string = '';

    return segments.map((segment: string): BreadCrumb => {
      url += `/${segment}`;
      return {
        label: this.formatLabel(segment),
        url,
      };
    });
  }

  private formatLabel(segment: string): string {
    const category: Category = Category[segment.toUpperCase() as keyof typeof Category];

    if (category) {
      return categoriesData[category];
    } else {
      return segment.toLowerCase().replace(/-/g, ' ').replace(/^./, (char) => char.toUpperCase());
    }
  }
}
