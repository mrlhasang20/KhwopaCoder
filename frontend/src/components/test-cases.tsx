import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TestCase {
  input: string
  output: string
}

interface TestCasesProps {
  testCases: TestCase[]
}

export function TestCases({ testCases }: TestCasesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Example Test Cases</h3>
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="w-full">
          {testCases.map((_, index) => (
            <TabsTrigger key={index} value={index.toString()} className="flex-1">
              Example {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {testCases.map((testCase, index) => (
          <TabsContent key={index} value={index.toString()} className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="mb-2 font-medium">Input:</h4>
                  <pre className="p-3 overflow-x-auto rounded-md bg-muted font-mono text-sm">{testCase.input}</pre>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="mb-2 font-medium">Output:</h4>
                  <pre className="p-3 overflow-x-auto rounded-md bg-muted font-mono text-sm">{testCase.output}</pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
