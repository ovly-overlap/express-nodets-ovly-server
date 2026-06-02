// match.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "match",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // 💡 여기서 실제로 두 값이 같은지 비교합니다.
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue; // 두 값이 같으면 true, 다르면 false
        },
      },
    });
  };
}
