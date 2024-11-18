import { GamesService } from './../../../games/services/games.service';
import { Component } from '@angular/core';

import {
  Category,
  Discount,
  Game,
  Specs,
} from '../../../games/interfaces/games.interfaces';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';
import { switchMap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-game-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    TooltipComponent,
    RouterModule,
  ],
  templateUrl: './new-game-page.component.html',
  styles: ``,
})
export class NewGamePageComponent {
  public categories: Category[] = [];

  public selectedCategories: Category[] = [];

  public selectedImages: string[] = [];

  public removeCategory(category: Category) {
    this.selectedCategories = this.selectedCategories.filter(
      (c) => c !== category
    );
  }

  public removeImage(image: string) {
    this.selectedImages = this.selectedImages.filter((i) => i !== image);
  }

  addImage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const imageURL = inputElement.value;

    if (imageURL && !this.selectedImages.includes(imageURL)) {
      this.selectedImages.push(imageURL);
    }
  }

  addCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategory = selectElement.value;

    if (
      selectedCategory &&
      !this.selectedCategories.includes(selectedCategory as Category)
    ) {
      this.selectedCategories.push(selectedCategory as Category);
    }
  }

  get isCreateMode(): boolean {
    return this.gameForm.controls.id.value === '';
  }

  public gameForm = new FormGroup({
    id: new FormControl<string>(''),
    title: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
    developer: new FormControl<string>('', Validators.required),
    keywords: new FormControl<string[]>([]),
    categories: new FormControl<Category[]>([], Validators.required),
    price: new FormControl<number>(0, Validators.required),
    specs: new FormControl<Specs>(
      {
        OS: '',
        Processor: '',
        Memory: '',
        Graphics: '',
        DirectX: '',
        Storage: '',
      },
      Validators.required
    ),
    popularity: new FormControl<number>(0),
    stock: new FormControl<number>(0, Validators.required),
    images: new FormControl<string[]>([], Validators.required),
    discount: new FormControl<Discount>({ type: 'none' }),
    reviews: new FormControl<any[]>([]),
    releaseDate: new FormControl<string>(''),
  });

  public specsForm = new FormGroup({
    OS: new FormControl<string>(''),
    Processor: new FormControl<string>(''),
    Memory: new FormControl<string>(''),
    Graphics: new FormControl<string>(''),
    DirectX: new FormControl<string>(''),
    Storage: new FormControl<string>(''),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    //? caso cuando está creando uno nuevo
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.gamesService.getGameById(id)))
      .subscribe((game) => {
        if (!game) {
          return this.router.navigateByUrl('/');
        }
        //sí hay heroe
        this.gameForm.reset(game);
        this.selectedCategories = game.categories;
        this.selectedImages = game.images;
        this.specsForm.reset(game.specs);
        return;
      });
  }

  get currentGame(): Game {
    const hero = this.gameForm.value as Game;
    return hero;
  }

  onSubmit() {
    console.log(this.gameForm.value);

    this.gameForm.controls.categories.setValue(this.selectedCategories);
    this.gameForm.controls.images.setValue(this.selectedImages);
    this.gameForm.controls.specs.setValue(this.specsForm.value as Specs);

    if (this.gameForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isCreateMode) {
      this.gamesService.createGame(this.currentGame).subscribe((game) => {
        this.router.navigate([
          '/administration/games/edit',
          this.currentGame.id,
        ]);
      });
    } else {
      this.gamesService.updateGame(this.currentGame).subscribe((game) => {
        this.router.navigate(['/administration/games']);
      });
    }
  }

  onDelete() {
    this.gamesService.deleteGame(this.currentGame.id).subscribe(() => {
      this.router.navigate(['/administration/games']);
    });
  }
}
