import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Pill, Calendar, Activity } from 'lucide-react';

const DashboardInventory = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Real-time medicine stock levels across hospitals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-chart-2/10">
                  <Pill className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medicine Types</p>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <Calendar className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Inventory Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Activity className="h-8 w-8 opacity-50" />
                      <p className="text-sm">Select a hospital to view inventory</p>
                      <code className="text-xs bg-primary/10 px-2 py-1 rounded text-primary">
                        GET /api/hospitals/{'{id}'}/inventory/
                      </code>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardInventory;
