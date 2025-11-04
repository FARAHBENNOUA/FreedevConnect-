import { render, screen, fireEvent } from '@testing-library/react';
import ProjectForm from './ProjectForm';

test('soumet le formulaire avec données valides', () => {
  render(<ProjectForm />);

  fireEvent.change(screen.getByLabelText(/titre du projet/i), {
    target: { value: 'Refonte site e-commerce' },
  });

  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'Créer une interface responsive avec React.js et Node.js' },
  });

  fireEvent.change(screen.getByLabelText(/budget/i), {
    target: { value: '1500' },
  });

  fireEvent.click(screen.getByRole('button', { name: /créer le projet/i }));

  expect(screen.getByText(/projet créé avec succès/i)).toBeInTheDocument();
});
