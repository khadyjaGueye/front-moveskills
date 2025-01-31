import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../../../shared/services/test.service';
import { Root, Root2 } from '../interface/model';
import Swal from 'sweetalert2';
import { FormateurService } from '../service/formateur.service';
import { SharedModule } from '../../../../shared/shared.module';

export interface ChoiceForm {
  choice_text: string;
  is_correct: boolean;
}

export interface QuestionForm {
  question_text: string;
  choices: FormArray<FormGroup<{ choice_text: FormControl<string>; is_correct: FormControl<boolean> }>>;
}


@Component({
  selector: 'app-show-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './show-test.component.html',
  styleUrl: './show-test.component.css'
})
export class ShowTestComponent implements OnInit {

  parcourId: number | null = null;
  parcours: any;
  evaluationType: string = "" // 'pre' ou 'post'
  tests: Root2[] = [];
  testDetails: Root2 | null = null;
  currentTestIndex: number = 0; // Index du test actuellement affiché
  display: boolean = false;
  isLoading: boolean = false;
  testId: number = 1;
  selectedTest: any;
  testForm: FormGroup

  constructor(private route: ActivatedRoute, private service: TestService, private serviceF: FormateurService, private fb: FormBuilder) {
    this.testForm = this.fb.group({
      type: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.parcourId = +this.route.snapshot.paramMap.get('id')!;
    this.evaluationType = this.route.snapshot.paramMap.get('evaluation')!;
    this.fetchTests();
  }

  fetchTests() {
    this.isLoading = true
    if (this.parcourId) {
      this.service.getTestsByParcoursId(this.parcourId).subscribe({
        next: (data) => {
          this.tests = data;
         // console.log(this.tests); // Debug : Affiche les données dans la console.
         this.isLoading = false
        },
        error: (err) => console.error('Erreur de récupération des tests :', err),
      });
    }
  }

  nextPage() {
    if (this.currentTestIndex < this.tests!.length - 1) {
      this.currentTestIndex++;
    }
  }

  previousPage() {
    if (this.currentTestIndex > 0) {
      this.currentTestIndex--;
    }
  }

  openModalupdateTest(id: number) {
    this.testId = id;
    this.display = true;

    this.selectedTest = this.tests.find((test) => test.id === id);
    if (this.selectedTest) {
      this.testForm.patchValue({
        type: this.selectedTest.type,
      });

      // const questionArray = this.fb.array<FormGroup<QuestionForm>>([]);
      // this.selectedTest.questionstests.forEach((question) => {
      //   const choiceArray = this.fb.array<FormGroup<{ choice_text: FormControl<string>; is_correct: FormControl<boolean> }>>(
      //     question.choices.map((choice) =>
      //       this.fb.group({
      //         choice_text: [choice.choice_text, Validators.required],
      //         is_correct: [choice.is_correct],
      //       })
      //     )
      //   );

      //   questionArray.push(
      //     this.fb.group({
      //       question_text: [question.question_text, Validators.required],
      //       choices: choiceArray,
      //     })
      //   );
      // });
      // this.testForm.setControl('questionstests', questionArray);
    }
  }





  closeModal() {
    this.display = false;
  }


  deleteTest(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera le test définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#114C5A  ',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed && this.parcourId) {
        this.service.delete(this.parcourId, id).subscribe({
          next: (resp) => {
            // Mise à jour locale après suppression
            this.tests = this.tests.filter(c => c.id !== id);
            Swal.fire('Supprimé !', 'Le test a été supprimée avec succès.', 'success');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
          }
        });
      }
    });
  }




  onSubmit() {
    if (this.testForm.valid) {
      const updatedTest = { id: this.testId, ...this.testForm.value };
      if (this.parcourId) {
        this.service.update(this.testId, this.parcourId, updatedTest).subscribe(
          {
            next: (response) => {
              this.closeModal();
              Swal.fire('Modification !', 'Le test a été modifiée avec succès.', 'success');
            },
            error: (error) => {
              console.log(error);
            }
          }
        );
      }
    }
  }

  get questionstests(): FormArray {
    return this.testForm.get('questionstests') as FormArray;
  }

  getChoices(index: number): FormArray<FormGroup<{ choice_text: FormControl<string>; is_correct: FormControl<boolean> }>> {
    return this.questionstests.at(index).get('choices') as FormArray<FormGroup<{ choice_text: FormControl<string>; is_correct: FormControl<boolean> }>>;
  }

}
