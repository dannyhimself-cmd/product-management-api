import { 
    ValidatorConstraint, 
    ValidatorConstraintInterface, 
    ValidationArguments, 
} from "class-validator";

@ValidatorConstraint({name: "priceRange", async: false})
export class PriceRangeValidator implements ValidatorConstraintInterface {

    defaultMessage(): string {
        return "maxPrice must be larger than minPrice!"
    }

    validate(value: unknown, args: ValidationArguments): boolean {
        const object = args.object as { minPrice?: number};
        const minPrice = object.minPrice;
        const maxPrice = value;
    
        if (minPrice === undefined || maxPrice === undefined) {
            return true;
        }        

        return typeof maxPrice === "number" && minPrice <= maxPrice;
    }
}