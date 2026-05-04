import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const jobs = [
  { title: 'Senior Full Stack Developer', location: 'Lagos (Remote)', type: 'Full-time' },
  { title: 'Sales Manager - Africa', location: 'Nairobi', type: 'Full-time' },
  { title: 'Customer Success Specialist', location: 'Accra', type: 'Full-time' },
  { title: 'Marketing Lead', location: 'Lagos', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">Join Our Team</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Help us build trust in social commerce across Africa.</p>
        
        <div className="space-y-4 mb-8">
          {jobs.map((job, i) => (
            <Card key={i} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
              </div>
              <Button variant="outline" size="sm">Apply Now</Button>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}