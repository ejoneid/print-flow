import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { printQueueItem, type PrintQueueItemBody } from "shared/browser";
import { clsx } from "clsx";
import {globalEventEmitter} from "@/utils/eventEmitter.ts";

const materialTypes = ["PLA", "PETG", "ASA", "TPU"];
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
type PrintRequestFormProps = { onSubmit: (values: FormValues) => void; isSubmitting: boolean };

export function PrintRequestForm({ onSubmit, isSubmitting }: PrintRequestFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(printQueueItem),
    defaultValues: {
      name: "",
      modelLink: "",
      description: "",
      materials: [{ type: "", color: "" }],
    },
  });

  globalEventEmitter.on('print-request-created', () => {
      form.reset();
  })

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
              {form.watch("materials").map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey:
                  key={`material-${index}`}
                  className="flex gap-2 mb-2"
                >
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`materials.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="min-w-40">
                                <SelectValue placeholder="Material Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materialTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
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
                                  <span className={clsx(`h-4 w-4 ${color.colorClassName} rounded-full`)} />
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
