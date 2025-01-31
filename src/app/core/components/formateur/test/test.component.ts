import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormateurService } from '../service/formateur.service';
import { Parcour } from '../../../../interfaces/model';
import { environment } from '../../../../../environments/environment.development';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,SharedModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {

  testForm: FormGroup;
  parcours: Parcour[] = [];
  evaluations: string[] = ["pre-evaluation", "post-evaluation"]
  display: boolean = false;
  isLoading:boolean = false
  idParcour: number = 1;

  constructor(private fb: FormBuilder, private service: FormateurService, private router: Router) {
    this.testForm = this.fb.group({
      type: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getDataParcours();
  }
  get questions(): FormArray {
    return this.testForm.get('questions') as FormArray;
  }

  getChoices(index: number): FormArray {
    const question = this.questions.at(index);
    return (question.get('choices') as FormArray) || this.fb.array([]);
  }

  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        question_text: ['', Validators.required],
        // note: ['', Validators.required],
        choices: this.fb.array([this.createChoice()]),
      })
    );
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addChoice(questionIndex: number): void {
    this.getChoices(questionIndex).push(this.createChoice());
  }

  createChoice(): FormGroup {
    return this.fb.group({
      choice_text: ['', Validators.required],
      is_correct: [false],
    });
  }

  onSubmit(): void {
    this.service.url = `${environment.apiBaseUrl}parcours/${this.idParcour}/tests`
    if (this.testForm.valid) {
      //console.log(this.testForm.value);
      this.service.store(this.testForm.value).subscribe({
        next: (resp) => {
          this.service.handleResponse(resp);
          this.testForm.reset();
          this.display = false;
        }, error: (error) => {
          this.service.handleResponse(error);
        }
      })
    }
  }

  getDataParcours() {
    this.isLoading = true;
    this.service.url = environment.apiBaseUrl + "parcours/formateur"
    this.service.all().subscribe({
      next: (response) => {
        this.parcours = response.data.parcours;
        this.isLoading = false;
      }
    })
  }
  openModalAjoutTest(id: number) {
    this.idParcour = id
    this.display = true
  }


  // Méthode pour fermer le modal (par exemple, en cliquant sur un bouton "Fermer")
  closeModal(): void {
    this.display = false; // Masque le modal
  }

  openShowTest(id: number) {
    this.router.navigate(['/core/formateur/show-test', id]); // Passer l'ID du parcours
  }
}
