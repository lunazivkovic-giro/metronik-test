import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { uniqueSerialNumbersValidator } from '../../shared/validator.validator';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  orderId: string | null = null;
  showOrderDetails: boolean = false;
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      id: [''],
      orderId: [''],
      expectedCompletionTime: [''],
      omsId: ['', { validators: [Validators.required], updateOn: 'submit' }],
      products: this.fb.array([this.createProductGroup()]),
      orderDetails: this.fb.group({
        factoryId: [''],
        factoryName: [''],
        factoryAddress: [''],
        factoryCountry: [''],
        productionLineId: [''],
        productCode: [''],
        productDescription: [''],
        poNumber: [''],
        expectedStartDate: ['']
      })
    });
  }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.isLoading = true;
      this.orderService.getOrderById(this.orderId).subscribe(order => {
        this.populateForm(order);
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
    } else {
      this.generateOrderId();
      this.generateExpectedCompletionTime();
    }
  }
  close() {
    this.router.navigate(['/orders']);
  }
  populateForm(order: any) {
    this.orderForm.patchValue({
      orderId: order.orderId,
      expectedCompletionTime: order.expectedCompletionTime,
      omsId: order.omsId,
      orderDetails: {
        factoryId: order.orderDetails.factoryId,
        factoryName: order.orderDetails.factoryName,
        factoryAddress: order.orderDetails.factoryAddress,
        factoryCountry: order.orderDetails.factoryCountry,
        productionLineId: order.orderDetails.productionLineId,
        productCode: order.orderDetails.productCode,
        productDescription: order.orderDetails.productDescription,
        poNumber: order.orderDetails.poNumber,
        expectedStartDate: order.orderDetails.expectedStartDate
      }
    });
    this.setProducts(order.products);
    if(order.orderDetails.factoryId){

      this.toggleOrderDetails()
    }
  }

  setProducts(products: any[]) {
    const productFGs = products.map(product => this.createProductGroup(product));
    const productFormArray = this.fb.array(productFGs);
    this.orderForm.setControl('products', productFormArray);
  }

  createProductGroup(product?: any): FormGroup {
    return this.fb.group({
      gtin: [product ? product.gtin : '', { validators: [Validators.required, Validators.minLength(14), Validators.maxLength(14)], updateOn: 'submit' }],
      quantity: [product ? product.quantity : '', { validators: [Validators.required, Validators.pattern('^[0-9]+$')], updateOn: 'submit' }],
      serialNumberType: [product ? product.serialNumberType : '', { validators: [Validators.required] }],
      serialNumbers: this.fb.array(
        product ? product.serialNumbers?.map((sn: any) => this.fb.group({ serialNumber: [sn.serialNumber, [Validators.required]] }))
          : [],
        { validators: [uniqueSerialNumbersValidator] }
      ),
      templateId: [product ? product.templateId : '', { validators: [Validators.required], updateOn: 'submit' }]
    });
  }

  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  onInput(event: Event, product: any): void {
    const serialNumberType = (event.target as HTMLInputElement).value;
    this.updateSerialNumbers(product, serialNumberType);
  }

  updateSerialNumbers(product: AbstractControl, serialNumberType: string | null) {
    const serialNumbers = this.getSerialNumbers(product);

    if (serialNumberType === 'SELF_MADE') {
      if (serialNumbers.length === 0) {
        serialNumbers.push(this.fb.group({ serialNumber: ['', [Validators.required]] }));
      }
    } else {
      while (serialNumbers.length !== 0) {
        serialNumbers.removeAt(0);
      }
    }
    serialNumbers.updateValueAndValidity();
  }

  getSerialNumbers(product: AbstractControl): FormArray {
    return product.get('serialNumbers') as FormArray;
  }

  addProduct() {
    this.products.push(this.createProductGroup());
    this.orderForm?.get('products')?.updateValueAndValidity();
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
    this.orderForm?.get('products')?.updateValueAndValidity();
  }

  removeSerialNumber(productIndex: number, serialNumberIndex: number) {
    const product = this.products.at(productIndex);
    this.getSerialNumbers(product).removeAt(serialNumberIndex);
    this.orderForm?.get('products')?.updateValueAndValidity();
  }

  toggleOrderDetails() {
    this.showOrderDetails = !this.showOrderDetails;

    const controls = this.orderForm.get('orderDetails') as FormGroup;
    if (this.showOrderDetails) {
      Object.keys(controls.controls).forEach(key => {
        const control = controls.get(key);
        if (['factoryId', 'factoryCountry', 'productionLineId', 'productCode', 'productDescription'].includes(key)) {
          control?.setValidators([Validators.required]);
        }
        control?.updateValueAndValidity();
      });
    } else {
      Object.keys(controls.controls).forEach(key => {
        const control = controls.get(key);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
    }
  }

  addSerialNumber(productIndex: number) {
    const product = this.products.at(productIndex);
    this.getSerialNumbers(product).push(this.fb.group({ serialNumber: ['', [Validators.required]] }));
  }

  generateOrderId() {
    this.orderForm?.get('orderId')?.setValue(
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
    );
  }

  generateExpectedCompletionTime() {
    this.orderForm?.get('expectedCompletionTime')?.setValue(
      Math.floor(1000 + Math.random() * 9000)
    );
  }

  submit() {
    this.submitted = true;

    if (this.orderForm.valid) {
      this.isLoading = true;
      if (this.orderId) {
        this.orderService.updateOrder(this.orderForm.value).subscribe(() => {
          this.router.navigate(['/orders']);
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
        });
      } else {
        this.generateOrderId();
        this.generateExpectedCompletionTime();

        this.orderService.createOrder(this.orderForm.value).subscribe(() => {
          this.router.navigate(['/orders']);
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
        });
      }
    } else {
      this.markFormGroupTouched(this.orderForm);
    }
  }

  isInvalidProductField(product: AbstractControl, field: string): boolean | undefined {
    return product.get(field)?.invalid && (product.get(field)?.touched || this.submitted);
  }

  isInvalidSerialNumberField(serialNumber: AbstractControl, field: string): boolean | undefined {
    return serialNumber.get(field)?.invalid && (serialNumber.get(field)?.touched || this.submitted);
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }
}

