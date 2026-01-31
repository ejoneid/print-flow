import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { printQueueItemSchema, type PrintQueueItemBody } from "shared/browser";
import { clsx } from "clsx";
import { globalEventEmitter } from "@/utils/eventEmitter.ts";

const materialTypes = [
  {
    name: "Choose material for me",
    value: "UNSPECIFIED",
    description: "Let us select the best material for your print based on your requirements.",
    pricePerKilo: undefined,
  },
  {
    name: "PLA",
    value: "PLA",
    description: "Easy to print, biodegradable, good surface finish. Not heat resistant, brittle under stress.",
    pricePerKilo: "150-350NOK",
  },
  {
    name: "PETG",
    value: "PETG",
    description: "Strong, durable, heat resistant, weather resistant. Slightly harder to print, can string.",
    pricePerKilo: "250-500NOK",
  },
  {
    name: "ASA",
    value: "ASA",
    description: "UV resistant, weather resistant, heat resistant, durable. Requires enclosed printer.",
    pricePerKilo: "400-700NOK",
  },
  {
    name: "TPU",
    value: "TPU",
    description: "Flexible, impact resistant, durable, weather resistant. Slow to print",
    pricePerKilo: "500-1000NOK",
  },
];

const materialColors = [
  { name: "Any color", colorClassName: "" },
  { name: "Black", colorClassName: "bg-black" },
  { name: "White", colorClassName: "bg-white border border-black" },
  { name: "Red", colorClassName: "bg-red-600" },
  { name: "Blue", colorClassName: "bg-blue-600" },
  { name: "Green", colorClassName: "bg-green-500" },
  { name: "Yellow", colorClassName: " bg-yellow-300" },
  { name: "Orange", colorClassName: "bg-orange-400" },
  { name: "Gray", colorClassName: "bg-gray-600" },
];

export type FormValues = PrintQueueItemBody;
type PrintRequestFormProps = {
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
};

export function PrintRequestForm({ onSubmit, isSubmitting }: PrintRequestFormProps) {
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(printQueueItemSchema),
    defaultValues: {
      name: "",
      modelLink: "",
      description: "",
      materials: [{ type: "", color: "" }],
    },
  });

  globalEventEmitter.on("print-request-created", () => {
    form.reset();
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Print Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Smartphone Stand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any special instructions or details about your print request"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="block mb-2">Materials</Label>
              {form.watch("materials").map((material, index) => (
                <div key={`material-${material.type}-${material.color}`} className="flex gap-2 mb-2">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`materials.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Material Type">
                                  {field.value && materialTypes.find((t) => t.value === field.value)?.name}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-96 max-w-[calc(100vw-4rem)]">
                              {materialTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="max-w-full">
                                  <div className="flex flex-col gap-1 py-1 max-w-full">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-medium">{type.name}</span>
                                      {type.pricePerKilo && (
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {type.pricePerKilo} per kg
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-normal break-words">
                                      {type.description}
                                    </p>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`materials.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="min-w-40">
                                <SelectValue placeholder="Color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materialColors.map((color) => (
                                <SelectItem key={color.name} value={color.name}>
                                  <span className={clsx(`h - 4 w - 4 ${color.colorClassName} rounded - full`)} />
                                  {color.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const currentMaterials = form.getValues("materials");
                        form.setValue(
                          "materials",
                          currentMaterials.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={form.watch("materials").length >= 4}
                onClick={() => {
                  const currentMaterials = form.getValues("materials");
                  form.setValue("materials", [...currentMaterials, { type: "", color: "" }]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Print Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
